import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type {ReadonlyConfig} from "adnbn";

import {ConfigFinder, StyleFinder} from "../../src/plugin/finder";

let root: string;

beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-finders-"));
});

afterEach(async () => {
    await fs.rm(root, {recursive: true, force: true});
});

describe.each([
    {Finder: ConfigFinder, base: "ui.config", first: "tsx", second: "ts"},
    {Finder: StyleFinder, base: "ui.style", first: "scss", second: "css"},
])("$base discovery", ({Finder, base, first, second}) => {
    const finder = (name: string) => new Finder(name, {rootDir: root} as ReadonlyConfig).setSearchDirs(["."]);
    const file = (extension: string) => `${base}.${extension}`;

    it("uses extension priority only when no supported extension is specified", async () => {
        await fs.writeFile(path.join(root, file(first)), "");
        await fs.writeFile(path.join(root, file(second)), "");
        expect(finder(base).getFiles().map(info => path.basename(info.import))).toEqual([file(first)]);
        expect(finder(file(second)).getFiles().map(info => path.basename(info.import))).toEqual([file(second)]);
    });

    it("does not substitute another extension when the exact file is missing", async () => {
        await fs.writeFile(path.join(root, file(first)), "");
        expect(finder(file(second)).getFiles()).toEqual([]);
    });

    it("preserves a nested path with an explicit extension", async () => {
        await fs.mkdir(path.join(root, "nested"));
        await fs.writeFile(path.join(root, "nested", file(second)), "");
        const files = finder(path.join("nested", file(second))).getFiles();
        expect(files).toHaveLength(1);
        expect(files[0].import).toBe(path.join(root, "nested", file(second)).split(path.sep).join("/"));
    });

    it("skips directories named like source files", async () => {
        await fs.mkdir(path.join(root, file(first)));
        await fs.writeFile(path.join(root, file(second)), "");
        expect(finder(base).getFiles().map(info => path.basename(info.import))).toEqual([file(second)]);
        expect(finder(file(first)).getFiles()).toEqual([]);
    });
});
