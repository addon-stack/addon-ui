import assert from "node:assert/strict";
import path from "node:path";
import {test} from "node:test";
import {ESLint} from "eslint";

import config from "../../eslint.config.js";

const cwd = path.resolve(import.meta.dirname, "../..");
const options = {filePath: "tests/tooling/import-fixture.ts"};

const fixer = new ESLint({
    cwd,
    overrideConfigFile: true,
    overrideConfig: [...config, {rules: {"@typescript-eslint/no-unused-vars": "off"}}],
    fix: true,
});

async function format(source) {
    const [first] = await fixer.lintText(source, options);
    assert.equal(first.errorCount, 0, JSON.stringify(first.messages));
    const output = first.output ?? source;
    const [again] = await fixer.lintText(output, options);
    assert.equal(again.output, undefined, "Import fixes must be stable on the second run");
    assert.equal(again.errorCount, 0, JSON.stringify(again.messages));

    return output;
}

test("imports use React, Radix, external, internal, same-directory and asset groups", async () => {
    const groups = [
        ['import React from "react";', 'import {createRoot} from "react-dom/client";',
            'import type {ReactPortal} from "react-dom";', 'import {jsx} from "react/jsx-runtime";'],
        ['import {Root} from "@radix-ui/react-accordion";', 'import {Slot} from "radix-ui";'],
        ['import classnames from "classnames";', 'import path from "node:path";',
            'import Highlight from "react-highlight-words";', 'import "external-polyfill";',
            'import {Plugin} from "adnbn";', 'import {Storage} from "@addon-core/storage";'],
        ['import {helper} from "../helpers";', 'import config from "#addon-ui/config";',
            'import {Button} from "addon-ui";', 'import {defineConfig} from "addon-ui/config";',
            'import {parent} from "..";', 'import {shared} from "../../shared";'],
        ['import {local} from "./local";', 'import {barrel} from ".";',
            'import {useLocal} from "./hooks/use-local";', 'import type {LocalProps} from "./types";',
            'import "./register";'],
        ['import "./z.scss";', 'import "./a.scss";', 'import styles from "./button.module.scss";',
            'import icon from "./icon.svg?raw";', 'import "react/theme.css";',
            'import "@radix-ui/themes/styles.css";', 'import "../styles/reset.scss";'],
    ];

    const output = await format([...groups.slice(2), ...groups.slice(0, 2)].flat().join("\n") + "\n");
    const actual = output.trim().split("\n\n");
    assert.equal(actual.length, 6, output);

    for (const [index, expected] of groups.entries()) {
        assert.deepEqual(new Set(actual[index].split("\n")), new Set(expected));
    }

    assert.ok(output.indexOf('"./z.scss"') < output.indexOf('"./a.scss"'));
});

for (const [name, source, expected] of [
    ["types followed by a default-only value import",
        'import type {FC, PropsWithChildren} from "react";\nimport React from "react";\n',
        'import React, {type FC, type PropsWithChildren} from "react";\n'],
    ["a default-only value import followed by types",
        'import React from "react";\nimport type {FC, PropsWithChildren} from "react";\n',
        'import React, {type FC, type PropsWithChildren} from "react";\n'],
    ["React default, values and types",
        'import type {FC} from "react";\nimport React from "react";\nimport {memo} from "react";\n',
        'import React, {type FC, memo} from "react";\n'],
    ["aliased Radix types and values",
        'import type {AccordionSingleProps as Props} from "@radix-ui/react-accordion";\n' +
            'import {Root as AccordionRoot} from "@radix-ui/react-accordion";\n',
        'import {type AccordionSingleProps as Props, Root as AccordionRoot} from "@radix-ui/react-accordion";\n'],
    ["values followed by types",
        'import {memo} from "react";\nimport type {FC} from "react";\n',
        'import {type FC, memo} from "react";\n'],
    ["internal types and values",
        'import type {Settings} from "./helpers";\nimport {getSettings} from "./helpers";\n',
        'import {getSettings, type Settings} from "./helpers";\n'],
]) {
    test(`autofix merges ${name} into one import`, async () => {
        assert.equal(await format(source), expected);
    });
}

test("types are marked inline when inferred alongside runtime values", async () => {
    const output = await format('import {CSSProperties, useState} from "react";\n' +
        "export type Style = CSSProperties;\nexport {useState};\n");

    assert.match(output, /import \{type CSSProperties, useState\} from "react"/);
});

test("merged multiline imports close on a new line with a trailing comma", async () => {
    const source = 'import type {ChangeEventHandler, ComponentProps} from "react";\n' +
        "import React, {\n    forwardRef,\n    memo,\n    useCallback,\n    useEffect,\n" +
        '    useImperativeHandle,\n    useRef,\n    useState} from "react";\n';

    const output = await format(source);

    const expected = [
        "type ChangeEventHandler", "type ComponentProps", "forwardRef", "memo", "useCallback",
        "useEffect", "useImperativeHandle", "useRef", "useState",
    ];

    const declaration = `import React, { ${expected.join(", ")}, } from "react"; `;
    assert.equal(output.replace(/\s+/g, " "), declaration);
    assert.match(output, /useState,\n} from "react";\n$/);
});

test("multiline re-exports close on a new line while short imports remain inline", async () => {
    const output = await format('import {memo, useState} from "react";\n' +
        "export {\n    memo,\n    useState};\n");

    assert.equal(output, 'import {memo, useState} from "react";\n\nexport {\n    memo,\n    useState,\n};\n');
});

test("namespace and default type imports retain their required syntax", async () => {
    const source = 'import type ReactType from "react";\nimport * as React from "react";\n' +
        'import {memo} from "react";\n';

    const output = await format(source);
    assert.match(output, /import type ReactType from "react"/);
    assert.match(output, /import \* as React from "react"/);
    assert.match(output, /import \{memo\} from "react"/);
});

test("different asset query strings are distinct imports", async () => {
    const source = 'import raw from "./icon.svg?raw";\nimport url from "./icon.svg?url";\n' +
        'import styles from "./button.scss?raw";\nimport "./button.scss";\n';

    const output = await format(source);
    assert.equal(output.match(/^import /gm).length, 4);
    assert.match(output, /icon\.svg\?raw/);
    assert.match(output, /icon\.svg\?url/);
    assert.match(output, /button\.scss\?raw/);
    assert.match(output, /"\.\/button\.scss"/);
});
