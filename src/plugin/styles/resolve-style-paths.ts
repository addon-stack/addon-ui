import {statSync} from "node:fs";
import path from "node:path";
import type {Root} from "postcss";
import valueParser from "postcss-value-parser";

const isRelative = (value: string): boolean =>
    Boolean(value) && !/^(?:[a-z][\w+.-]*:|[/#~$]|#\{)/i.test(value);

const isFile = (filename: string): boolean => {
    try {
        return statSync(filename).isFile();
    } catch (error) {
        if (!["ENOENT", "ENOTDIR"].includes((error as NodeJS.ErrnoException).code ?? "")) {
            throw error;
        }

        return false;
    }
};

// Only establish whether a local Sass candidate exists. Sass still resolves partials,
// indexes and ambiguity; choosing a file here would bypass those rules.
const hasLocalModule = (filename: string, legacyImport: boolean): boolean => {
    const extensions = [".scss", ".sass", ".css"];

    const candidates = extensions.includes(path.extname(filename))
        ? [filename]
        : extensions.flatMap(extension => [
            filename + extension, path.join(filename, "index" + extension),
        ]);

    if (legacyImport) {
        candidates.push(...candidates.map(candidate => {
            const extension = path.extname(candidate);

            return candidate.slice(0, -extension.length) + ".import" + extension;
        }));
    }

    return candidates.some(candidate =>
        isFile(candidate) || isFile(path.join(path.dirname(candidate), "_" + path.basename(candidate)))
    );
};

export const resolveStylePaths = (root: Root, filename: string): void => {
    const absolute = (value: string) => path.resolve(path.dirname(filename), value).split(path.sep).join("/");

    const resolveUrls = (value: string): string => {
        const parsed = valueParser(value);

        parsed.walk(node => {
            if (node.type !== "function" || node.value.toLowerCase() !== "url") {
                return;
            }

            const target = node.nodes.filter(part => part.type !== "space" && part.type !== "comment");

            if (target.length === 1 && ["string", "word"].includes(target[0].type)) {
                const url = target[0];

                if (isRelative(url.value) && !url.value.includes("#{") && !url.value.includes("$")) {
                    const suffix = url.value.search(/[?#]/);
                    const resource = suffix < 0 ? url.value : url.value.slice(0, suffix);
                    const resolved = absolute(resource) + (suffix < 0 ? "" : url.value.slice(suffix));

                    // Quoting also protects spaces and parentheses in the source directory.
                    node.nodes = [{type: "string", quote: '"', value: resolved,
                        sourceIndex: url.sourceIndex, sourceEndIndex: url.sourceEndIndex}];
                }
            }

            return false;
        });

        return parsed.toString();
    };

    root.walkDecls(declaration => {
        declaration.value = resolveUrls(declaration.value);
    });

    root.walkAtRules(rule => {
        if (!["use", "forward", "import"].includes(rule.name)) {
            return;
        }

        const parsed = valueParser(resolveUrls(rule.params));

        // @import can contain a comma-separated list; strings inside functions or
        // configuration expressions are not module requests.
        for (const node of parsed.nodes) {
            if (node.type !== "string") {
                continue;
            }

            if (isRelative(node.value) && !node.value.includes("#{")) {
                const resolved = absolute(node.value);

                if (node.value.startsWith(".") || hasLocalModule(resolved, rule.name === "import")) {
                    node.value = resolved;
                }
            }

            if (rule.name !== "import") {
                break;
            }
        }

        rule.params = parsed.toString();
    });
};
