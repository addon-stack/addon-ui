import {type ChildNode, root as createRoot} from "postcss";
import * as scss from "postcss-scss";

import {resolveStylePaths} from "./resolve-style-paths";
import type {StyleSource} from "./types";

export const mergeStyleSources = (sources: readonly StyleSource[]): string => {
    const charsets: ChildNode[] = [];
    const prelude: ChildNode[] = [];
    const cssPrelude: ChildNode[] = [];
    const bodies: ChildNode[] = [];
    const seen = new Set<string>();

    for (const source of sources) {
        const tree = scss.parse(source.content, {from: source.filename});
        resolveStylePaths(tree, source.filename);
        let bodyStarted = false;
        let modulesClosed = false;
        const sourceDirectives = new Set<string>();

        for (const node of tree.nodes) {
            const module = node.type === "atrule" && ["use", "forward"].includes(node.name);

            if (module && modulesClosed) {
                throw node.error(`@${node.name} must precede other rules in its source stylesheet`);
            }

            const variable = node.type === "decl" && node.prop.startsWith("$");
            const charset = node.type === "atrule" && node.name === "charset";

            const cssRule = node.type === "atrule" && !node.nodes &&
                ["import", "namespace", "layer"].includes(node.name);

            if (!modulesClosed && (module || variable || charset || node.type === "comment")) {
                // Configuration can depend on variables that have since changed. Do
                // not deduplicate configured loads, variables, or invalid repetitions
                // within a single source. Let Sass diagnose module conflicts.
                const reusable = charset || (module && !/\bwith\s*\(/.test(node.params));
                const key = reusable ? node.toString(scss.stringify).trim() : undefined;

                if (key) {
                    sourceDirectives.add(key);
                }

                if (!key || !seen.has(key)) {
                    (charset ? charsets : prelude).push(node.clone());
                }
            } else if (!bodyStarted && (cssRule || node.type === "comment")) {
                modulesClosed = true;
                cssPrelude.push(node.clone());
            } else {
                modulesClosed = true;
                bodyStarted = true;
                bodies.push(node.clone());
            }
        }

        sourceDirectives.forEach(key => seen.add(key));
    }

    const result = createRoot();

    for (const node of [...charsets, ...prelude, ...cssPrelude, ...bodies]) {
        node.raws.before = "\n";
        result.append(node);
    }

    result.raws.semicolon = true;

    return result.toString(scss.stringify);
};
