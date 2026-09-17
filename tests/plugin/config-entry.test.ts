import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {CssExtractRspackPlugin, rspack} from "@rspack/core";

import {build, createCompiler, readResult} from "../support/plugin/compiler";

it("keeps the config entry free of UI runtime, styles and virtual config before tree shaking", async () => {
    const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-config-entry-")));

    try {
        const entry = path.resolve("src/config/index.ts");

        await fs.writeFile(path.join(root, "entry.ts"), `
            import {defineConfig} from ${JSON.stringify(entry)};
            export default defineConfig({icons: {logo: {mode: "asset", src: "logo.svg"}}});
        `);

        const compiler = createCompiler(root);
        compiler.options.optimization.sideEffects = false;
        compiler.options.optimization.usedExports = false;
        expect(compiler.options.mode).toBe("development");
        const stats = await build(compiler);
        expect(stats.toString({all: false, errors: true})).toBe("");
        const modules = stats.toJson({all: false, modules: true}).modules!;
        const files = modules.flatMap(module => module.nameForCondition ? [module.nameForCondition] : []);
        expect(files).toContain(entry);
        expect(files.filter(file => file !== path.join(root, "entry.ts") && file !== entry)).toEqual([]);

        expect(readResult(compiler).config.icons.logo).toEqual({mode: "asset", src: "logo.svg"});
    } finally {
        await fs.rm(root, {recursive: true, force: true});
    }
});

it("tree shakes UI components when consuming icon definitions from the public entry", async () => {
    const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-icon-entry-")));

    try {
        await fs.writeFile(path.join(root, "entry.ts"), `
            import {IconMode, getIconDefinition} from ${JSON.stringify(path.resolve("src/index.ts"))};
            export default {mode: IconMode.Sprite, sourceMode: getIconDefinition(() => null).mode};
        `);

        const compiler = rspack({
            context: root,
            mode: "production",
            target: "node",
            entry: "./entry.ts",
            devtool: false,
            output: {path: path.join(root, "dist"), filename: "main.cjs", library: {type: "commonjs2"}},
            resolve: {extensions: [".ts", ".tsx", ".js"], modules: [path.resolve("node_modules"), "node_modules"]},
            resolveLoader: {modules: [path.resolve("node_modules")]},
            module: {rules: [
                {test: /\.tsx?$/, use: {loader: "builtin:swc-loader", options: {jsc: {
                    parser: {syntax: "typescript", tsx: true},
                    transform: {react: {runtime: "automatic"}},
                }}}},
                {test: /\.s?css$/, use: [CssExtractRspackPlugin.loader, "css-loader", "sass-loader"]},
            ]},
            optimization: {minimize: false, concatenateModules: false},
            plugins: [new CssExtractRspackPlugin({filename: "main.css"})],
        })!;

        const stats = await build(compiler);
        expect(stats.toString({all: false, errors: true})).toBe("");

        const modules = stats.toJson({
            all: false, modules: true, ids: true, orphanModules: true, modulesSpace: Infinity,
            groupModulesByPath: false, groupModulesByType: false,
        }).modules!;

        const emitted = modules.filter(module => module.chunks?.length && module.nameForCondition)
            .map(module => module.nameForCondition!);

        expect(emitted).toContain(path.resolve("src/components/Icon/types.ts"));
        expect(emitted).toContain(path.resolve("src/components/Icon/utils.ts"));

        expect(emitted.filter(file => file !== path.join(root, "entry.ts")
            && !["types.ts", "utils.ts"].some(name => file === path.resolve("src/components/Icon", name))))
            .toEqual([]);

        const result = readResult(compiler);
        expect(result.config).toEqual({mode: "sprite", sourceMode: "sprite"});
        expect(result.css).toBe("");
    } finally {
        await fs.rm(root, {recursive: true, force: true});
    }
});
