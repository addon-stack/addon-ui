import assert from "node:assert/strict";
import path from "node:path";
import {test} from "node:test";
import {ESLint, Linter} from "eslint";
import tseslint from "typescript-eslint";

import config from "../../eslint.config.js";
import project from "../../tools/eslint/index.mjs";

const cwd = path.resolve(import.meta.dirname, "../..");
const linter = new Linter({cwd});

const check = (rule, source, filename = "src/utils/example.ts") => linter.verify(source, [{
    files: ["**/*.{ts,tsx,mjs,cjs}"],
    languageOptions: {parser: tseslint.parser, parserOptions: {ecmaFeatures: {jsx: true}}},
    plugins: {project},
    rules: {[`project/${rule}`]: "error"},
}], {filename: path.join(cwd, filename)});

for (const [filename, source] of [
    ["src/components/Button/Button.tsx", 'import React from "react"; export function Button() { return <div />; }'],
    ["src/components/Button/Button.tsx", 'import {memo as cache} from "react"; const Button = () => null; ' +
        "export default cache(Button);"],
    ["src/components/Button/Button.tsx", 'import React from "react"; const Button = React.memo(React.forwardRef(' +
        "() => null)); export default Button;"],
    ["src/components/Button/Button.stories.tsx", "export const Primary = {}; export const Secondary = {};"],
    ["tests/components/button.test.tsx", "export {};"],
    ["src/providers/theme/ThemeStorage.ts", "export default class ThemeStorage {}"],
    ["src/example/Widget.cjs", "class Widget {} module.exports = Widget;"],
    ["src/example/Widget.cjs", "module.exports = class Widget {};"],
    ["tests/support/components/storage.cjs", "module.exports = {Storage: class {}};"],
    ["src/hooks/floating/use-floating-focus.ts", "export function useFloatingFocus() {}"],
    ["src/hooks/floating/index.ts", 'export {useFloatingFocus} from "./use-floating-focus";'],
    ["src/types/contracts.d.ts", "export interface Contract {}"],
]) {
    test(`accepts repository filename ${filename}: ${source.slice(0, 35)}`, () => {
        assert.deepEqual(check("file-naming", source, filename), []);
    });
}

for (const [filename, source] of [
    ["src/components/Button/button.tsx", "export function Button() { return null; }"],
    ["src/components/Button/Other.tsx", "export class Button {}"],
    ["src/components/Button/index.tsx", "export function Button() { return null; }"],
    ["src/components/button/Button.tsx", "export function Button() { return null; }"],
    ["src/utils/BadDirectory/helper.ts", "export function helper() {}"],
    ["src/hooks/useFloatingFocus.ts", "export function useFloatingFocus() {}"],
    ["src/providers/theme/ThemeStorage.ts", "export default class {}"],
    ["src/example/widget.cjs", "class Widget {} module.exports = {Widget};"],
    ["src/components/Button/Button.tsx", "export function Button() {} export function Other() {}"],
]) {
    test(`rejects repository filename ${filename}: ${source}`, () => {
        const messages = check("file-naming", source, filename);
        assert.ok(messages.length > 0);
        assert.ok(messages.every(message => message.ruleId === "project/file-naming" && !message.fix));
    });
}

test("distinguishes exported data, functions, hooks, aliases and re-exports", () => {
    const valid = "export const DialogPropsKeys = []; export const useExample = () => null; " +
        "const readValue = () => 1; export {readValue}; const localValue = 1; " +
        'export {externalValue} from "./external";';

    assert.deepEqual(check("export-naming", valid), []);
    assert.deepEqual(check("export-naming", "export let currentValue = 0;"), []);
    assert.equal(check("export-naming", "const sharedValue = []; export {sharedValue};").length, 1);
    assert.equal(check("export-naming", "export const SHARED_VALUE = [];").length, 1);
    assert.equal(check("export-naming", "export function GetValue() { return 1; }").length, 1);
    assert.equal(check("export-naming", "export const use_example = () => null;").length, 1);
});

test("keeps a wrapped implementation in its module but rejects standalone helpers", () => {
    const source = 'import {memo, forwardRef} from "react"; function ButtonBase() { return null; } ' +
        "const Button = memo(forwardRef(ButtonBase)); export default Button;";

    assert.deepEqual(check("separate-modules", source, "src/components/Button/Button.tsx"), []);

    assert.equal(check("separate-modules", source + " function helper() {}",
        "src/components/Button/Button.tsx").length, 1);
});

for (const [filename, source, valid] of [
    ["src/components/Button/Button.tsx", 'import {useTheme} from "../../providers";', true],
    ["src/components/Button/Button.tsx", 'import {useTheme} from "../../providers/theme/context";', false],
    ["src/providers/theme/ThemeProvider.tsx", 'import {ThemeContext} from "./context";', true],
    ["src/providers/icons/IconsProvider.tsx", 'import {ThemeContext} from "../theme/context";', false],
    ["src/providers/index.ts", 'export * from "./theme";', true],
    ["src/components/Button/Button.tsx", 'import {useFloatingLayer} from "../../hooks/floating";', true],
    ["tests/components/button.test.tsx", 'import {registerLayer} from "../../src/hooks/floating/registry";', false],
    ["src/hooks/floating/use-floating-focus.ts", 'import {registerLayer} from "./registry";', true],
    ["src/hooks/floating/use-floating-focus.ts", 'import {useFloatingLayer} from "./index";', false],
    ["src/utils/dom/example.ts", 'import {useState} from "react";', false],
    ["src/utils/dom/example.ts", 'import {getShadowRoot} from "./shadow";', true],
    ["src/utils/example.ts", 'export {Button} from "../components/Button";', false],
    ["src/hooks/example.ts", 'import("../components/Button");', false],
    ["src/utils/example.ts", 'require("../components/Button");', false],
    [".storybook/preview.tsx", 'import "../src/providers/ui/styles/base.scss";', true],
    ["src/components/Icon/definition/types.ts", 'import type {ComponentType} from "react";', true],
    ["src/components/Icon/definition/types.ts", 'import {type ComponentType} from "react";', true],
    ["src/components/Icon/definition/icon-definition.ts", 'import {IconMode} from "./types";', true],
    ["src/components/Icon/definition/index.ts", 'export * from "./types";', true],
    ["src/components/Icon/definition/types.ts", 'import {useId} from "react";', false],
    ["src/components/Icon/definition/types.ts", 'import type {IconProps} from "../Icon";', false],
    ["src/components/Icon/definition/index.ts", 'export * from "../index";', false],
    ["src/components/Icon/definition/icon-definition.ts", 'import("../../../providers");', false],
    ["src/components/Icon/definition/icon-definition.ts", 'require("addon-ui");', false],
    ["src/components/Icon/definition/icon-definition.ts", 'import "../icon.module.scss";', false],
    ["src/components/Icon/definition/icon-definition.ts", 'import "./style.scss";', false],
]) {
    test(`module boundaries: ${filename}: ${source}`, () => {
        assert.equal(check("module-boundaries", source, filename).length, valid ? 0 : 1);
    });
}

test("requires a React value import, including fragments and type-only imports", () => {
    assert.equal(check("react-import", "export const Button = () => <></>;", "src/Button.tsx").length, 1);

    assert.equal(check("react-import", 'import type React from "react"; const Button = () => <div />;',
        "src/Button.tsx").length, 1);

    assert.deepEqual(check("react-import", 'import * as React from "react"; const Button = () => <div />;',
        "src/Button.tsx"), []);
});

test("full autofix is stable and preserves the JSX runtime import and CSS order", async () => {
    const fixer = new ESLint({cwd, overrideConfigFile: true, overrideConfig: config, fix: true});

    const source = 'import React,{FC} from "react";\nimport "./z.scss";\nimport "./a.scss";\n' +
        'const Button:FC=()=>{const unused: any = null; void unused;return <button title="OK"/>};\n' +
        "export default Button;\n";

    const options = {filePath: "src/components/Button/Button.tsx"};
    const [first] = await fixer.lintText(source, options);
    assert.equal(first.errorCount, 0, JSON.stringify(first.messages));
    assert.match(first.output, /import React, \{type FC\} from "react"/);
    assert.ok(first.output.indexOf('"./z.scss"') < first.output.indexOf('"./a.scss"'));
    const [again] = await fixer.lintText(first.output, options);
    assert.equal(again.output, undefined);
    assert.equal(again.errorCount, 0);
});

test("JSON formatting is stable and JSONC alone permits comments", async () => {
    const fixer = new ESLint({cwd, overrideConfigFile: true, overrideConfig: config, fix: true});
    const [first] = await fixer.lintText('{"enabled":true,"items":[1,2]}', {filePath: "settings.json"});
    assert.equal(first.errorCount, 0);
    assert.match(first.output, /\n {2}"enabled": true/);
    const [again] = await fixer.lintText(first.output, {filePath: "settings.json"});
    assert.equal(again.output, undefined);

    for (const extension of ["json", "jsonc"]) {
        const [result] = await fixer.lintText('// Comment\n{"enabled":true}', {filePath: `settings.${extension}`});
        assert.equal(result.errorCount > 0, extension === "json");
    }
});

test("generated files and private playground are excluded; configs and stories are checked", async () => {
    const checker = new ESLint({cwd, overrideConfigFile: true, overrideConfig: config});

    for (const file of ["addon/src/App.tsx", "dist-types/index.d.ts", "coverage/report.js",
        "tests/fixtures/shadow-dom/node_modules/example/index.js", "tests/fixtures/shadow-dom/dist/main.js",
        "tests/fixtures/shadow-dom/artifacts/stats.json", "tests/fixtures/shadow-dom/package-lock.json"]) {
        assert.equal(await checker.isPathIgnored(file), true, file);
    }

    for (const file of [".storybook/preview.tsx", "jest.config.cjs", "playwright.config.mjs",
        "src/components/Button/Button.stories.tsx"]) {
        assert.equal(await checker.isPathIgnored(file), false, file);
    }
});
