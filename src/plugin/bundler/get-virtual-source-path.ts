import path from "node:path";

export const getVirtualSourcePath = (context: string, module: string): string => path.resolve(
    context, "node_modules/.addon-ui-virtual",
    `${module.replace(/^#/, "")}${path.extname(module) ? "" : ".js"}`
);
