import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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
