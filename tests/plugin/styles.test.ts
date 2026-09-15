import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {compileString} from "sass";

import {mergeStyleSources} from "../../src/plugin/styles";
import {build, createCompiler, readResult, watch} from "../support/plugin/compiler";
import {createSources} from "../support/plugin/sources";

let root: string;

beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-styles-"));

    await fs.writeFile(path.join(root, "entry.ts"),
        'export {default} from "#addon-ui/config"; import "#addon-ui/style.scss?isolation";');
});

afterEach(async () => {
    await fs.rm(root, {recursive: true, force: true});
});

const write = async (file: string, content: string) => {
    const filename = path.join(root, file);
    await fs.mkdir(path.dirname(filename), {recursive: true});
    await fs.writeFile(filename, content);
};

const source = (file: string, content: string) => ({filename: path.join(root, file), content});

const compile = (content: string) => compileString(content, {url: pathToFileURL(path.join(root, "virtual.scss"))});

it("merges complete module preludes, preserves configuration variables and the shared Sass scope", async () => {
    await write("app/_tokens.scss", "$accent: red !default; $spacing: 0 !default;");
    await write("app/_extra.scss", "$other: 3;");

    const merged = mergeStyleSources([
        source("shared/ui.style.scss", `
            @use "sass:math";
            $size: 11px;
            @mixin common { padding: $size; }
            .shared { width: math.div(10px, 2); }
        `),
        source("app/ui.style.scss", `
            // This comment must not consume the next statement.
            @use "sass:math";
            $accent: blue;
            @forward "./extra"
                show $other;
            @use "./tokens" with (
                $accent: $accent,
                $spacing: math.div(8px, 2)
            );
            .app { @include common; color: tokens.$accent; margin: tokens.$spacing; }
        `),
    ]);

    const {css} = compile(merged);
    expect(css).toContain("color: blue");
    expect(css).toContain("padding: 11px");
    expect(css).toContain("margin: 4px");
    expect(css.indexOf(".shared")).toBeLessThan(css.indexOf(".app"));
});

it("retains variables and diagnoses configured loads and namespace conflicts", async () => {
    await write("_tokens.scss", "$color: red !default;");

    const variables = mergeStyleSources([
        source("shared.scss", "$x: red; $x: blue;"),
        source("app.scss", "$x: red; .app {color: $x;}"),
    ]);

    expect(compile(variables).css).toContain("color: red");

    const configured = '$color: red; @use "./tokens" with ($color: $color);';
    const conflict = mergeStyleSources([source("shared.scss", configured), source("app.scss", configured)]);
    expect(() => compile(conflict)).toThrow(/already loaded/);
    const duplicate = mergeStyleSources([source("app.scss", '@use "sass:math"; @use "sass:math";')]);
    expect(() => compile(duplicate)).toThrow(/namespace/);
});

it.each([".first {color: red;}", '@import "base.css";'])(
    "reports a late @use in the original source after %s", prefix => {
        expect(() => mergeStyleSources([
            source("app/ui.style.scss", `${prefix}\n@use "sass:math";`),
        ])).toThrow(/app\/ui\.style\.scss:2:1/);
    }
);

it("keeps CSS imports and ordering declarations before both bodies without deduplicating CSS effects", () => {
    const merged = mergeStyleSources([
        source("shared.scss", '@layer base, app; @import "https://example.com/base.css"; .shared {}'),
        source("app.scss", '@use "sass:math"; @import "https://example.com/base.css"; .app {}'),
    ]);

    expect(merged.match(/@import/g)).toHaveLength(2);
    expect(merged.lastIndexOf("@import")).toBeLessThan(merged.indexOf(".shared"));
    expect(merged.indexOf("@use")).toBeLessThan(merged.indexOf("@layer"));
});

it("resolves same-named modules, root assets and nested partial assets from each original directory", async () => {
    for (const [directory, color, namespace] of [
        ["shared", "red", "sharedTokens"], ["app theme.v2", "blue", "appTokens"],
    ]) {
        await write(`${directory}/_tokens.scss`, `$color: ${color};`);
        await write(`${directory}/nested/_index.scss`, '@forward "./deep/part";');

        await write(`${directory}/nested/deep/_part.scss`, `
            .nested-${color} {background-image: url("./nested.svg?part=1#icon");}
        `);

        await write(`${directory}/nested/deep/nested.svg`, `<svg xmlns="http://www.w3.org/2000/svg"><!--nested-${color}--></svg>`);
        await write(`${directory}/root.svg`, `<svg xmlns="http://www.w3.org/2000/svg"><!--root-${color}--></svg>`);

        await write(`${directory}/ui.style.scss`, `
            @use "tokens" as ${namespace};
            @use "./nested" as nested${namespace};
            .${color} {color: ${namespace}.$color; background: url("./root.svg?root=1#icon");}
        `);
    }

    const compiler = createCompiler(root, createSources(root));
    const stats = await build(compiler);
    expect(stats.toString({all: false, errors: true})).toBe("");
    const {css} = readResult(compiler);
    expect(css).toContain("color: red");
    expect(css).toContain("color: blue");
    expect(css).toContain("?part=1#icon");
    expect(css).toContain("?root=1#icon");
    const emitted = await fs.readdir(path.join(root, "dist"));

    const assets = await Promise.all(emitted.filter(file => file.endsWith(".svg"))
        .map(file => fs.readFile(path.join(root, "dist", file), "utf8")));

    expect(assets).toHaveLength(4);

    for (const name of ["root-red", "root-blue", "nested-red", "nested-blue"]) {
        expect(assets.some(asset => asset.includes(name))).toBe(true);
    }
});

it("leaves package requests and non-file URLs intact", () => {
    const merged = mergeStyleSources([source("app.scss", `
        @use "sass:math";
        @use "addon-ui/theme";
        .x {
            a: url("data:image/svg+xml,%3Csvg%3E"); b: url("https://example.com/a.svg");
            c: url("//cdn.example.com/a.svg"); d: url("/root.svg"); e: url("#icon");
            f: url("~package/asset.svg");
        }
    `)]);

    for (const value of ["sass:math", "addon-ui/theme", "data:image", "https://example.com",
        "//cdn.example.com", 'url("/root.svg")', 'url("#icon")', "~package/asset.svg"]) {
        expect(merged).toContain(value);
    }
});

it("preserves resource query/hash text while rebasing only the pathname", () => {
    const merged = mergeStyleSources([source("app/ui.style.scss",
        '.x {background: url("./icon.svg?path=a/../b#icon");}')]);

    expect(merged).toContain(path.join(root, "app/icon.svg") + "?path=a/../b#icon");
});

it("resolves dotted module names and legacy import-only partials", async () => {
    await write("app/_tokens.v2.scss", "$size: 17px;");
    await write("app/_legacy.import.scss", "$color: red;");

    const merged = mergeStyleSources([source("app/ui.style.scss", `
        @use "tokens.v2" as tokens;
        @import "legacy";
        .app {width: tokens.$size; color: $color;}
    `)]);

    const {css} = compileString(merged, {
        url: pathToFileURL(path.join(root, "virtual.scss")), silenceDeprecations: ["import"],
    });

    expect(css).toContain("width: 17px");
    expect(css).toContain("color: red");
});

it("tracks nested Sass dependencies and recovers after a partial is deleted and recreated", async () => {
    await write("shared/ui.style.scss", '@use "./nested/part";');
    await write("shared/nested/_part.scss", '.nested {width: 17px; background: url("./asset.svg");}');
    await write("shared/nested/asset.svg", '<svg xmlns="http://www.w3.org/2000/svg"><!--before--></svg>');
    const session = watch(createCompiler(root, createSources(root)));

    try {
        const initial = await session.next(result => result.value?.css.includes("17px") === true);
        let next = session.next(result => result.value !== undefined && result.value.css !== initial.value?.css);
        await write("shared/nested/asset.svg", '<svg xmlns="http://www.w3.org/2000/svg"><!--after--></svg>');
        await next;
        next = session.next(result => result.value?.css.includes("29px") === true);
        await write("shared/nested/_part.scss", ".nested {width: 29px;}");
        await next;
        next = session.next(result => result.stats.hasErrors());
        await fs.unlink(path.join(root, "shared/nested/_part.scss"));
        await next;
        next = session.next(result => result.value?.css.includes("31px") === true);
        await write("shared/nested/_part.scss", ".nested {width: 31px;}");
        await next;
    } finally {
        await session.close();
    }
}, 30_000);
