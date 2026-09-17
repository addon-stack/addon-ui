import {execFile} from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {promisify} from "node:util";

import {build, createCompiler, readResult} from "../support/plugin/compiler";

const execute = promisify(execFile);

it("resolves the packed package's fallback config and SCSS without aliases or ui()", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-package-"));

    try {
        const {stdout} = await execute(process.platform === "win32" ? "npm.cmd" : "npm", [
            "pack", "--ignore-scripts", "--json", "--pack-destination", root, "--cache", path.join(root, "cache"),
        ], {cwd: path.resolve(__dirname, "../..")});

        const [archive] = JSON.parse(stdout);
        const files = archive.files.map((file: {path: string}) => file.path);
        expect(files).toEqual(expect.arrayContaining(["src/virtual/config.ts", "src/virtual/style.scss"]));
        expect(files.some((file: string) => /^(addon|tests)\//.test(file))).toBe(false);
        const installed = path.join(root, "node_modules/addon-ui");
        await fs.mkdir(installed, {recursive: true});
        await execute("tar", ["-xzf", path.join(root, archive.filename), "-C", installed, "--strip-components=1"]);

        // A probe inside the installed package exercises its private package-import scope.
        await fs.writeFile(path.join(installed, "probe.ts"),
            'export {default} from "#addon-ui/config"; import "#addon-ui/style.scss";');

        await fs.writeFile(path.join(root, "entry.ts"), 'export {default} from "./node_modules/addon-ui/probe";');
        const compiler = createCompiler(root);
        const stats = await build(compiler);
        expect(stats.toString({all: false, errors: true})).toBe("");
        expect(readResult(compiler).config).toEqual({components: {}, extra: {}, icons: {}});
        expect(readResult(compiler).css.trim()).toBe("");
    } finally {
        await fs.rm(root, {recursive: true, force: true});
    }
}, 30_000);
