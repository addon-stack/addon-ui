import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

import {buildDirectory} from "./paths.mjs";

export function verifyCustomizationBuild(root, engine) {
    const directory = buildDirectory(root, engine, "customization");
    const popup = fs.readFileSync(path.join(directory, "popup.html"), "utf8");
    const files = fs.readdirSync(directory, {recursive: true}).filter(file => file.endsWith(".css"));
    const layers = new Set();
    const lazyCSS = [];
    let appTokens = 0;

    for (const file of files) {
        const css = fs.readFileSync(path.join(directory, file), "utf8");
        const ast = postcss.parse(css);

        ast.walkAtRules("layer", rule => layers.add(rule.params));

        ast.walkDecls("--shared-token", declaration => {
            appTokens++;

            for (let parent = declaration.parent; parent; parent = parent.parent) {
                assert.notEqual(parent.name, "layer", "Application theme mixins must stay unlayered");
            }
        });

        if (css.includes("--tag-padding")) {
            assert.ok(!popup.includes(file), "Tag CSS must load lazily, after the application overrides");
            lazyCSS.push(file);
        }
    }

    for (const layer of ["addon-ui.reset", "addon-ui.tokens", "addon-ui.base", "addon-ui.components", "application"]) {
        assert.ok(layers.has(layer), `Missing ${layer} in emitted CSS`);
    }

    assert.ok(appTokens > 0, "Shared application theme must be emitted");
    assert.ok(lazyCSS.length > 0, "A separate Tag stylesheet must be emitted");

    return {stylesheets: files.length, layers: [...layers], lazyCSS};
}
