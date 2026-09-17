import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {VirtualSourcePlugin} from "../../src/plugin/bundler";
import {build, createCompiler, readResult, watch} from "../support/plugin/compiler";
import {createSources} from "../support/plugin/sources";

let root: string;

beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-modules-"));

    await fs.writeFile(path.join(root, "entry.ts"),
        'export {default} from "#addon-ui/config"; import "#addon-ui/style.scss";');
});

afterEach(async () => {
    await fs.rm(root, {recursive: true, force: true});
});

const write = async (directory: string, name: string, content: string) => {
    await fs.mkdir(path.join(root, directory), {recursive: true});
    await fs.writeFile(path.join(root, directory, name), content);
};

it("builds empty fallbacks without writing virtual files to disk", async () => {
    const compiler = createCompiler(root, createSources(root));
    const stats = await build(compiler);
    expect(stats.toString({all: false, errors: true})).toBe("");
    expect(readResult(compiler).config).toEqual({components: {}, extra: {}, icons: {}});
    await expect(fs.access(path.join(root, "node_modules/.addon-ui-virtual"))).rejects.toThrow();
});

it("resolves generated config dependencies without consumer module search paths", async () => {
    await write("shared", "ui.config.ts", "export default {extra: {values: [1], shared: true}};");
    await write("app theme.v2", "ui.config.ts", "export default {extra: {values: [2]}};");
    const compiler = createCompiler(root, createSources(root));
    // The generated module lives in a fresh consumer without ts-deepmerge. Only
    // addon-ui's own dependency resolution should provide it, not test hoisting.
    compiler.options.resolve.modules = [path.join(root, "node_modules")];
    const stats = await build(compiler);
    expect(stats.toString({all: false, errors: true})).toBe("");
    expect(readResult(compiler).config.extra).toEqual({values: [1, 2], shared: true});
});

it.each([true, false])("preserves priority and merge=%s for config and SCSS", async merge => {
    await write("shared", "ui.config.ts", 'export default {extra: {shared: true, winner: "shared", values: [1]}};');
    await write("app theme.v2", "ui.config.tsx", 'export default {extra: {winner: "app"}};');
    await write("shared", "ui.style.scss", ".shared {color: red;}");
    await write("app theme.v2", "ui.style.scss", ".app {color: blue;}");
    const compiler = createCompiler(root, createSources(root, merge));
    const stats = await build(compiler);
    expect(stats.hasErrors()).toBe(false);
    const {config, css} = readResult(compiler);
    expect(config.extra).toEqual(merge ? {shared: true, winner: "app", values: [1]} : {winner: "app"});
    expect(css).toContain(".app");

    if (merge) {
        expect(css.indexOf(".shared")).toBeLessThan(css.indexOf(".app"));
    } else {
        expect(css).not.toContain(".shared");
    }
});

it("refreshes additions, edits, removals and recovers from invalid SCSS/config in watch", async () => {
    const session = watch(createCompiler(root, createSources(root)));

    try {
        await session.next(result => !result.stats.hasErrors());
        let next = session.next(result => result.value?.config.extra.winner === "shared");
        await write("shared", "ui.config.ts", 'export default {extra: {winner: "shared"}};');
        await next;
        next = session.next(result => result.value?.css.includes("73px") === true);
        await write("app theme.v2", "ui.style.scss", ":root {--token: 73px;}");
        await next;
        next = session.next(result => result.value?.css.includes("91px") === true);
        await write("app theme.v2", "ui.style.scss", ":root {--token: 91px;}");
        await next;
        next = session.next(result => result.stats.hasErrors());
        await write("app theme.v2", "ui.style.scss", ".broken {color: $missing;}");
        await next;
        next = session.next(result => !result.stats.hasErrors() && result.value?.css.includes("19px") === true);
        await write("app theme.v2", "ui.style.scss", ":root {--token: 19px;}");
        await next;
        next = session.next(result => result.stats.hasErrors());
        await write("app theme.v2", "ui.config.ts", "export default {");
        await next;
        next = session.next(result => result.value?.config.extra.winner === "app");
        await write("app theme.v2", "ui.config.ts", 'export default {extra: {winner: "app"}};');
        await next;
        next = session.next(result => result.value?.config.extra.winner === "edited");
        await write("app theme.v2", "ui.config.ts", 'export default {extra: {winner: "edited"}};');
        await next;
        next = session.next(result => result.value?.config.extra.winner === "shared");
        await fs.unlink(path.join(root, "app theme.v2/ui.config.ts"));
        await next;
        next = session.next(result => result.value !== undefined && !result.value.css.includes("19px"));
        await fs.unlink(path.join(root, "app theme.v2/ui.style.scss"));
        await next;

        next = session.next(result =>
            result.value !== undefined && Object.keys(result.value.config.extra).length === 0
        );

        await fs.unlink(path.join(root, "shared/ui.config.ts"));
        await next;
    } finally {
        await session.close();
    }
}, 45_000);

it("keeps virtual sources local to each compiler", async () => {
    const plugin = (value: string) => new VirtualSourcePlugin({
        modules: ["#addon-ui/config", "#addon-ui/style.scss"],
        generate: () => ({"#addon-ui/config": `export default ${JSON.stringify(value)}`, "#addon-ui/style.scss": ""}),
        dependencies: () => ({}),
    });

    const first = createCompiler(root, [plugin("first")], "first");
    const second = createCompiler(root, [plugin("second")], "second");
    const results = await Promise.all([build(first), build(second)]);
    expect(results.every(stats => !stats.hasErrors())).toBe(true);
    expect(readResult(first).config).toBe("first");
    expect(readResult(second).config).toBe("second");
});

it("reports initial generator failures and recovers when its input changes", async () => {
    const input = path.join(root, "data.json");
    await fs.writeFile(input, "invalid JSON");

    const plugin = new VirtualSourcePlugin({
        modules: ["#addon-ui/config", "#addon-ui/style.scss"],
        generate: async () => ({
            "#addon-ui/config": `export default ${JSON.stringify(JSON.parse(await fs.readFile(input, "utf8")))}`,
            "#addon-ui/style.scss": "",
        }),
        dependencies: () => ({files: [input]}),
    });

    const session = watch(createCompiler(root, [plugin]));

    try {
        await session.next(result => result.stats.hasErrors());
        const next = session.next(result => result.value?.config.recovered === true);
        await fs.writeFile(input, '{"recovered":true}');
        await next;
    } finally {
        await session.close();
    }
});
