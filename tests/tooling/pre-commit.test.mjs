import assert from "node:assert/strict";
import {execFileSync, spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";

const repository = path.resolve(import.meta.dirname, "../..");

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "addon-ui-hook-"));
    t.after(() => fs.rmSync(root, {recursive: true, force: true}));

    const git = (...args) => execFileSync("git", args, {
        cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    });

    const write = (file, text) => {
        fs.mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
        fs.writeFileSync(path.join(root, file), text);
    };

    for (const file of ["eslint.config.js", "stylelint.config.mjs", ".lintstagedrc.mjs", ".husky/pre-commit"]) {
        write(file, fs.readFileSync(path.join(repository, file)));
    }

    fs.cpSync(path.join(repository, "tools"), path.join(root, "tools"), {recursive: true});
    fs.symlinkSync(path.join(repository, "node_modules"), path.join(root, "node_modules"), "dir");
    write(".gitignore", "node_modules/\naddon/\n");
    write("package.json", JSON.stringify({private: true, type: "module", scripts: {"lint:staged": "lint-staged"}}));

    write("jest.config.cjs", "module.exports = {testEnvironment: 'node', roots: ['<rootDir>/src'], " +
        "testMatch: ['**/*.test.cjs'], transform: {'^.+\\\\.tsx?$': ['@swc/jest', " +
        "{jsc: {parser: {syntax: 'typescript'}}}]}};");

    write("src/settings.ts", 'export const Settings = {enabled: false};\n\nexport const Local = "base";\n');

    write("src/settings.test.cjs", 'const {Settings} = require("./settings");\n' +
        'test("settings", () => {expect(Settings).toHaveProperty("enabled");});\n');

    write("src/button.scss", ".button {\n  color: red;\n}\n");
    git("init", "-q");
    git("add", ".");

    git("-c", "core.hooksPath=/dev/null", "-c", "user.name=Tooling Test", "-c", "user.email=test@example.invalid",
        "commit", "-qm", "Initial test fixture");

    const run = () => spawnSync("sh", [".husky/pre-commit"], {
        cwd: root, encoding: "utf8", timeout: 60000,
        env: {...process.env, FORCE_COLOR: "0"},
    });

    return {root, git, write, run};
}

test("pre-commit formats staged code and SCSS while preserving unstaged changes", t => {
    const {root, git, write, run} = fixture(t);
    write("src/settings.ts", 'export const Settings={enabled:true}\n\nexport const Local = "base";\n');
    write("src/button.scss", ".button{color:blue}");
    git("add", "src/settings.ts", "src/button.scss");
    write("src/settings.ts", 'export const Settings={enabled:true}\n\nexport const Local = "local";\n');
    write("addon/untouched.ts", "  invalid manual playground  ");
    write("src/unrelated.ts", "  unrelated untracked content  ");
    const result = run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const staged = git("show", ":src/settings.ts");
    assert.match(staged, /Settings = \{enabled: true\};/);
    assert.match(staged, /Local = "base"/);
    assert.match(fs.readFileSync(path.join(root, "src/settings.ts"), "utf8"), /Local = "local"/);
    assert.equal(git("show", ":src/button.scss"), ".button {\n  color: blue;\n}\n");
    assert.equal(fs.readFileSync(path.join(root, "src/unrelated.ts"), "utf8"), "  unrelated untracked content  ");
    assert.equal(fs.readFileSync(path.join(root, "addon/untouched.ts"), "utf8"), "  invalid manual playground  ");
    assert.equal(git("stash", "list"), "");
});

test("pre-commit rolls back fixes if a related component test fails", t => {
    const {root, git, write, run} = fixture(t);
    write("src/settings.ts", 'export const Settings={enabled:true}\n\nexport const Local = "base";\n');

    write("src/settings.test.cjs", 'const {Settings} = require("./settings");\n' +
        'test("settings", () => {expect(Settings.enabled).toBe(false);});\n');

    git("add", "src/settings.ts", "src/settings.test.cjs");
    const staged = git("diff", "--cached");
    const working = fs.readFileSync(path.join(root, "src/settings.ts"), "utf8");
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /FAIL.*settings\.test\.cjs/);
    assert.equal(git("diff", "--cached"), staged);
    assert.equal(fs.readFileSync(path.join(root, "src/settings.ts"), "utf8"), working);
    assert.equal(git("stash", "list"), "");
});

test("pre-commit blocks invalid filenames without renaming or retaining partial fixes", t => {
    const {root, git, write, run} = fixture(t);
    write("src/badName.ts", "export const Value=1");
    git("add", "src/badName.ts");
    const staged = git("diff", "--cached");
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /project\/file-naming/);
    assert.equal(git("diff", "--cached"), staged);
    assert.equal(fs.readFileSync(path.join(root, "src/badName.ts"), "utf8"), "export const Value=1");
});
