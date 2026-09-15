const isMultiline = node => node.loc.start.line !== node.loc.end.line;
const isImport = node => node.type === "ImportDeclaration" || node.type === "TSImportEqualsDeclaration";

const isReExport = node =>
    ["ExportNamedDeclaration", "ExportAllDeclaration"].includes(node.type) && node.source;

export default {
    meta: {
        type: "layout",
        docs: {description: "Separate multiline statements and declarations from adjacent code with a blank line."},
        fixable: "whitespace",
        schema: [],
        messages: {expectedBlankLine: "Add a blank line before and after a multiline statement or declaration."},
    },
    create(context) {
        const sourceCode = context.sourceCode;

        const checkStatements = statements => {
            for (let index = 1; index < statements.length; index++) {
                const previous = statements[index - 1];
                const next = statements[index];

                if (!isMultiline(previous) && !isMultiline(next)) {
                    continue;
                }

                // Preserve import/re-export groups managed by simple-import-sort.
                if (isImport(previous) && isImport(next) || isReExport(previous) && isReExport(next)) {
                    continue;
                }

                const previousToken = sourceCode.getLastToken(previous);
                const nextToken = sourceCode.getFirstToken(next);
                const comments = sourceCode.getTokensBetween(previous, next, {includeComments: true});
                const tokens = [previousToken, ...comments, nextToken];

                const hasBlankLine = tokens.some((token, tokenIndex) => tokenIndex > 0
                    && token.loc.start.line > tokens[tokenIndex - 1].loc.end.line + 1);

                if (hasBlankLine) {
                    continue;
                }

                // Keep trailing comments with the previous statement and leading comments with the next one.
                let anchor = previousToken;
                let following = nextToken;

                for (const comment of comments) {
                    if (comment.loc.start.line !== anchor.loc.end.line) {
                        following = comment;

                        break;
                    }

                    anchor = comment;
                }

                context.report({
                    node: next,
                    messageId: "expectedBlankLine",
                    fix: fixer =>
                        fixer.insertTextAfter(anchor, anchor.loc.end.line === following.loc.start.line ? "\n\n" : "\n"),
                });
            }
        };

        return {
            Program: node => checkStatements(node.body),
            BlockStatement: node => checkStatements(node.body),
            StaticBlock: node => checkStatements(node.body),
            TSModuleBlock: node => checkStatements(node.body),
            SwitchCase: node => checkStatements(node.consequent),
        };
    },
};
