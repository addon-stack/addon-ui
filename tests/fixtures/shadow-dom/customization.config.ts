import {defineConfig, Workspace} from "adnbn";

import baseConfig from "./adnbn.config";

export default defineConfig({
    ...baseConfig,
    workspace: Workspace.Multi,
    srcDir: "customization",
    app: "customization",
    name: "Addon UI customization integration",
});
