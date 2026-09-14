const unwrap = node => ["TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression"].includes(node?.type)
    ? unwrap(node.expression) : node;

export function getModuleShape(program, filename) {
    const bindings = new Map();
    const exports = new Set();
    const wrappers = new Set();
    const namespaces = new Set();

    for (const statement of program.body) {
        if (statement.type === "ImportDeclaration" && statement.source.value === "react") {
            for (const specifier of statement.specifiers) {
                if (specifier.type === "ImportSpecifier" && ["memo", "forwardRef"].includes(specifier.imported.name)) {
                    wrappers.add(specifier.local.name);
                } else if (specifier.type !== "ImportSpecifier") {
                    namespaces.add(specifier.local.name);
                }
            }
        }

        const declaration = statement.declaration ?? statement;

        if (["FunctionDeclaration", "ClassDeclaration"].includes(declaration.type) && declaration.id) {
            bindings.set(declaration.id.name, {node: declaration, value: declaration});
        } else if (declaration.type === "VariableDeclaration") {
            for (const node of declaration.declarations) {
                if (node.id.type === "Identifier") {
                    bindings.set(node.id.name, {node, value: node.init});
                }
            }
        }
    }

    const isWrapper = node => node?.type === "CallExpression" && (
        node.callee.type === "Identifier" && wrappers.has(node.callee.name)
        || node.callee.type === "MemberExpression" && namespaces.has(node.callee.object.name)
            && ["memo", "forwardRef"].includes(node.callee.property.name)
    );

    const resolve = (node, seen = new Set()) => {
        node = unwrap(node);

        if (node?.type === "Identifier" && bindings.has(node.name) && !seen.has(node.name)) {
            return resolve(bindings.get(node.name).value, new Set([...seen, node.name]));
        }

        return isWrapper(node) ? resolve(node.arguments[0], seen) : node;
    };

    const exportNode = node => {
        node = unwrap(node);

        if (isWrapper(node)) {
            exportNode(node.arguments[0]);
        } else if (node?.type === "Identifier") {
            exports.add(node.name);
        } else if (node?.id?.name) {
            exports.add(node.id.name);

            if (!bindings.has(node.id.name)) {
                bindings.set(node.id.name, {node, value: node});
            }
        } else if (["ClassDeclaration", "ClassExpression"].includes(node?.type)
            || /\.[jt]sx$/.test(filename) && ["FunctionDeclaration", "ArrowFunctionExpression", "FunctionExpression"]
                .includes(node?.type)) {
            exports.add(null);
        }
    };

    const isExports = node => node?.type === "Identifier" && node.name === "exports"
        || node?.type === "MemberExpression" && node.object.name === "module"
            && (node.property.name ?? node.property.value) === "exports";

    for (const statement of program.body) {
        if (statement.type === "ExportDefaultDeclaration") {
            exportNode(statement.declaration);
        } else if (statement.type === "ExportNamedDeclaration" && !statement.source) {
            if (statement.declaration?.type === "VariableDeclaration") {
                statement.declaration.declarations.forEach(node => exportNode(node.id));
            } else if (statement.declaration) {
                exportNode(statement.declaration);
            }

            statement.specifiers.forEach(node => exportNode(node.local));
        } else if (statement.type === "ExpressionStatement" && statement.expression.type === "AssignmentExpression") {
            const {left, right} = statement.expression;

            if (isExports(left) || left.type === "MemberExpression" && isExports(left.object)) {
                if (right.type === "ObjectExpression") {
                    right.properties.forEach(property => exportNode(property.value));
                } else {
                    exportNode(right);
                }
            }
        }
    }

    const isFunction = name => ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(
        resolve(bindings.get(name)?.value)?.type
    );

    const isClass = name => ["ClassDeclaration", "ClassExpression"].includes(resolve(bindings.get(name)?.value)?.type);

    const containsJsx = node => {
        if (!node || typeof node !== "object") {
            return false;
        }

        if (["JSXElement", "JSXFragment"].includes(node.type)) {
            return true;
        }

        return Object.entries(node).some(([key, value]) => key !== "parent" && (
            Array.isArray(value) ? value.some(containsJsx) : value?.type && containsJsx(value)
        ));
    };

    const components = [...bindings.keys()].filter(name => isFunction(name) && (
        containsJsx(resolve(bindings.get(name).value))
        || /^[A-Z]/.test(name) && (/\.[jt]sx$/.test(filename) || isWrapper(unwrap(bindings.get(name).value)))
    ));

    const classes = [...bindings.keys()].filter(isClass);
    const primary = [...exports].filter(name => components.includes(name) || classes.includes(name));

    const isPrimaryImplementation = name => primary.some(exported =>
        resolve(bindings.get(exported)?.value) === resolve(bindings.get(name)?.value)
    );

    return {bindings, exports, primary, components, classes, isFunction, isClass, isPrimaryImplementation};
}
