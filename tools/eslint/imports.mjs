import importX from "eslint-plugin-import-x";

const noDuplicates = importX.rules["no-duplicates"];

// import-x 4.17.1 produces `import Default, type {Props}` when a named type import
// precedes a default-only value import. Merge into the existing value declaration
// to retain valid syntax and its runtime position. Keep the upstream checks/fixes.
export default {
    ...importX,
    rules: {
        ...importX.rules,
        "no-duplicates": {
            ...noDuplicates,
            create(context) {
                const listeners = noDuplicates.create(context);
                const declarations = [];

                return {
                    ImportDeclaration: node => declarations.push(node),
                    "Program:exit": node => {
                        declarations.sort((left, right) =>
                            Number(left.importKind === "type") - Number(right.importKind === "type"));

                        declarations.forEach(declaration => listeners.ImportDeclaration(declaration));
                        listeners["Program:exit"](node);
                    },
                };
            },
        },
    },
};
