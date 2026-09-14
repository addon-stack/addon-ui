// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import tseslint from "typescript-eslint";

import globals from "globals";

import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
    {
        ignores: [
            "dist",
            "dist-types",
            "addon",
            "**/.adnbn/**",
            "tests/fixtures/shadow-dom/artifacts/**",
            "test-results",
            "build",
            "node_modules",
            "coverage",
            ".storybook",
            "public",
            "*.config.js",
            "storybook-static",
        ],
    },
    {
        ...js.configs.recommended,
        files: ["tests/**/*.mjs", "playwright.config.mjs"],
        languageOptions: {
            globals: {...globals.node, ...globals.browser},
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-empty-pattern": ["error", {allowObjectPatternsAsParameters: true}],
        },
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": "off",
            "@typescript-eslint/no-unused-vars": ["error", {ignoreRestSiblings: true}],
        },
    },
    storybook.configs["flat/recommended"]
);
