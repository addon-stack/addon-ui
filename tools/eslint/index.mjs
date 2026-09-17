import {existsSync} from "node:fs";
import path from "node:path";

import {getModuleShape} from "./module-shape.mjs";
import paddingAroundMultiline from "./padding-around-multiline.mjs";

const kebabCase = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const pascalCase = /^[A-Z][a-zA-Z0-9]*$/;
const camelCase = /^[a-z][a-zA-Z0-9]*$/;
const relativePath = context => path.relative(context.cwd, context.physicalFilename).split(path.sep).join("/");
const isWithin = (file, directory) => file === directory || file.startsWith(`${directory}/`);

const fileNaming = {
    meta: {
        type: "suggestion",
        schema: [{type: "object", properties: {exceptions: {type: "array", items: {type: "string"}}},
            additionalProperties: false}],
        messages: {
            filename: "Use kebab-case for ordinary filenames and lowercase suffixes: '{{name}}'.",
            primary: "Name this module '{{name}}' to match its component or class.",
            anonymous: "Give the exported component or class a name that matches its filename.",
            multiple: "Place each component or class in its own matching PascalCase module: {{names}}.",
            directory: "Use kebab-case for organizational directories " +
                "and PascalCase for component/class directories: " +
                "'{{name}}'.",
        },
    },
    create(context) {
        return {Program(program) {
            if (context.physicalFilename.startsWith("<")) {
                return;
            }

            const file = relativePath(context);
            const basename = path.basename(file);
            const parts = basename.replace(/^\./, "").split(".");
            const extension = parts.length > 1 ? parts.pop() : "";
            const [stem, ...suffixes] = parts;
            const example = suffixes.some(suffix => ["test", "spec", "stories", "story"].includes(suffix));

            const conventional = suffixes.includes("config")
                || file.startsWith(".storybook/") || extension === "md"
                || file.startsWith("tests/support/components/") && extension === "cjs";

            const shape = getModuleShape(program, context.physicalFilename);
            const report = (messageId, data) => context.report({node: program, messageId, data});
            const directories = file.split("/").slice(0, -1);

            directories.forEach((directory, index) => {
                const absolute = path.join(context.cwd, ...directories.slice(0, index + 1));

                const componentDirectory = file.startsWith("src/components/") && index === 2;

                const matchingModule = ["ts", "tsx", "js", "jsx"].some(ext =>
                    existsSync(path.join(absolute, `${directory}.${ext}`))
                );

                if (componentDirectory ? !pascalCase.test(directory)
                    : !kebabCase.test(directory.replace(/^\./, ""))
                        && !(pascalCase.test(directory) && matchingModule)) {
                    report("directory", {name: directory});
                }
            });

            if (context.options[0]?.exceptions?.includes(basename)) {
                return;
            }

            if (!example && !conventional && shape.exports.has(null)) {
                report("anonymous");
            } else if (!example && !conventional && shape.primary.length > 1) {
                report("multiple", {names: shape.primary.join(", ")});
            } else if (!example && !conventional && shape.primary.length === 1) {
                const [name] = shape.primary;
                const declaration = suffixes.length === 1 && suffixes[0] === "d";

                if (stem !== name || !pascalCase.test(name) || suffixes.length && !declaration) {
                    report("primary", {name: `${name}.${declaration ? "d." : ""}${extension}`});
                }
            } else if (extension === "md" && file.startsWith("docs/") && pascalCase.test(stem)) {
                // Public component documentation keeps its established URLs.
                return;
            } else if ((!kebabCase.test(stem) && !(example && pascalCase.test(stem)))
                || suffixes.some(suffix => !kebabCase.test(suffix))) {
                report("filename", {name: basename});
            }
        }};
    },
};

const exportNaming = {
    meta: {
        type: "suggestion", schema: [],
        messages: {
            data: "Use PascalCase for exported data constants: '{{name}}'.",
            function: "Use camelCase for hooks and utility functions: '{{name}}'.",
        },
    },
    create(context) {
        return {Program(program) {
            const shape = getModuleShape(program, context.physicalFilename);

            for (const name of shape.exports) {
                const binding = shape.bindings.get(name);

                if (!binding || shape.isClass(name) || shape.components.includes(name)) {
                    continue;
                }

                const fn = shape.isFunction(name);

                const constant = binding.node.type === "VariableDeclarator" && binding.node.parent.kind === "const";

                if (fn ? !camelCase.test(name) : constant && !pascalCase.test(name)) {
                    context.report({node: binding.node, messageId: fn ? "function" : "data", data: {name}});
                }
            }
        }};
    },
};

const separateModules = {
    meta: {
        type: "suggestion", schema: [],
        messages: {separate: "Move standalone '{{name}}' into its own component/class or utility module."},
    },
    create(context) {
        return {Program(program) {
            const shape = getModuleShape(program, context.physicalFilename);

            if (!shape.primary.length) {
                return;
            }

            for (const [name, {node}] of shape.bindings) {
                if (!shape.isPrimaryImplementation(name) && (shape.isFunction(name) || shape.isClass(name))) {
                    context.report({node, messageId: "separate", data: {name}});
                }
            }
        }};
    },
};

const moduleBoundaries = {
    meta: {
        type: "problem", schema: [],
        messages: {boundary: "{{reason}}"},
    },
    create(context) {
        const importer = relativePath(context);

        const check = node => {
            const source = node.source ?? node;
            const value = source.value;

            if (typeof value !== "string") {
                return;
            }

            if (isWithin(importer, "src/components/Icon/definition")) {
                const target = value.startsWith(".")
                    ? path.posix.normalize(path.posix.join(path.posix.dirname(importer), value)) : value;

                const reactTypes = value === "react" && node.type === "ImportDeclaration"
                    && (node.importKind === "type" || node.specifiers.length > 0
                        && node.specifiers.every(specifier => specifier.importKind === "type"));

                if (!reactTypes && (!isWithin(target, "src/components/Icon/definition")
                    || /\.(?:css|scss)(?:\?|$)/.test(value))) {
                    context.report({node: source, messageId: "boundary", data: {
                        reason: "Icon definitions may only import local definitions and React types.",
                    }});
                }

                return;
            }

            if (/\.(?:css|scss)(?:\?|$)/.test(value)) {
                return;
            }

            const target = (value.startsWith(".")
                ? path.posix.normalize(path.posix.join(path.posix.dirname(importer), value))
                : value).replace(/\.(?:[cm]?[jt]sx?)$/, "").replace(/\/index$/, "");

            let reason;

            if ((isWithin(importer, "src/utils") || isWithin(importer, "src/hooks"))
                && (isWithin(target, "src/components") || target === "addon-ui")) {
                reason = "Shared hooks and utilities must not import UI components.";
            } else if (isWithin(importer, "src/utils/dom")
                && (value === "react" || value.startsWith("react/") || isWithin(target, "src/hooks")
                    || isWithin(target, "src/providers"))) {
                reason = "DOM utilities must not depend on React, hooks or providers.";
            } else if (isWithin(target, "src/providers") && target !== "src/providers") {
                const provider = target.split("/").slice(0, 3).join("/");

                if (importer !== "src/providers/index.ts" && !isWithin(importer, provider)) {
                    reason = "Import providers through src/providers/index.ts; " +
                        "local provider imports may use siblings.";
                }
            } else if (isWithin(target, "src/hooks") && target.split("/").length > 3) {
                const group = target.split("/").slice(0, 3).join("/");

                if (!isWithin(importer, group)) {
                    reason = "Import shared hook groups through their index.ts.";
                }
            }

            if (isWithin(importer, "src/hooks")) {
                const group = importer.split("/").slice(0, 3).join("/");

                if (target === group) {
                    reason = "Modules inside a hook group must import siblings directly, avoiding their own index.ts.";
                }
            }

            if (reason) {
                context.report({node: source, messageId: "boundary", data: {reason}});
            }
        };

        return {
            ImportDeclaration: check,
            ExportNamedDeclaration: node => node.source && check(node),
            ExportAllDeclaration: check,
            ImportExpression: node => check(node.source),
            CallExpression: node => node.callee.name === "require" && node.arguments[0] && check(node.arguments[0]),
        };
    },
};

const reactImport = {
    meta: {type: "problem", schema: [], messages: {missing: "JSX requires a React value import for Addon Bone."}},
    create(context) {
        let jsx = false;

        return {
            JSXElement: () => {
                jsx = true;
            },
            JSXFragment: () => {
                jsx = true;
            },
            "Program:exit": program => {
                const imported = program.body.some(node => node.type === "ImportDeclaration"
                    && node.source.value === "react" && node.importKind !== "type"
                    && node.specifiers.some(specifier => ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"]
                        .includes(specifier.type) && specifier.local.name === "React"));

                if (jsx && !imported) {
                    context.report({node: program, messageId: "missing"});
                }
            },
        };
    },
};

export default {
    meta: {name: "addon-ui-project-rules"},
    processors: {"filename-only": {preprocess: () => [""], postprocess: messages => messages.flat()}},
    rules: {
        "file-naming": fileNaming,
        "export-naming": exportNaming,
        "separate-modules": separateModules,
        "module-boundaries": moduleBoundaries,
        "react-import": reactImport,
        "padding-around-multiline": paddingAroundMultiline,
    },
};
