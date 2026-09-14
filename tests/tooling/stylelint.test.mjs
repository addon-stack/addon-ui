import assert from "node:assert/strict";
import {test} from "node:test";
import * as sass from "sass";
import stylelint from "stylelint";

import config from "../../stylelint.config.mjs";

for (const [extension, source] of [
    ["css", ".button{color:red;padding: 0.5rem;&:hover{color:blue}}"],
    ["scss", "$root:button;\n// Keep comment\n@mixin color($value){color:$value;}\n" +
        ".#{$root}{@include color(red);&--large{padding: 1rem;}}"],
]) {
    test(`formats ${extension} once, preserves Sass output and is stable`, async () => {
        const options = {config, codeFilename: `example.${extension}`};
        const checked = await stylelint.lint({...options, code: source});
        assert.equal(checked.errored, true);
        const fixed = await stylelint.lint({...options, code: source, fix: true});
        assert.equal(fixed.errored, false, JSON.stringify(fixed.results[0].warnings));
        assert.match(fixed.code, /\n {2}(?:color|@include)/);

        assert.equal(sass.compileString(fixed.code, {style: "compressed"}).css,
            sass.compileString(source, {style: "compressed"}).css);

        const again = await stylelint.lint({...options, code: fixed.code, fix: true});
        assert.equal(again.code, fixed.code);
        assert.equal(again.errored, false);

        if (extension === "scss") {
            assert.match(fixed.code, /\/\/ Keep comment/);
        }
    });
}

test("rejects invalid CSS values and malformed SCSS", async () => {
    for (const source of [".button {color: #zzzzzz;}", ".button { color: red;"]) {
        const result = await stylelint.lint({config, code: source, codeFilename: "example.scss"});
        assert.equal(result.errored, true);
    }
});
