import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {test} from "node:test";
import ts from "typescript";

test("public entry points retain their explicit value and type export lists", () => {
    const root = path.resolve(import.meta.dirname, "../..");
    const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
    assert.equal(config.error, undefined);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
    const program = ts.createProgram(parsed.fileNames, parsed.options);
    const checker = program.getTypeChecker();
    const expected = JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/public-exports.json"), "utf8"));

    for (const [file, names] of Object.entries(expected)) {
        const source = program.getSourceFile(path.join(root, file));
        assert.ok(source, file);
        const symbol = checker.getSymbolAtLocation(source);
        assert.ok(symbol, file);
        assert.deepEqual(checker.getExportsOfModule(symbol).map(item => item.name).sort(), names, file);
    }
});
