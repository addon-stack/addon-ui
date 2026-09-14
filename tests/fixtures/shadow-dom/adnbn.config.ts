import path from "node:path";
import fs from "node:fs";
import {createRequire} from "node:module";
import {defineConfig, Workspace} from "adnbn";
import ui from "addon-ui/plugin";
import type {RspackPluginInstance} from "@rspack/core";

const fixtureRequire = createRequire(path.resolve("package.json"));
const frameworkAliases = Object.fromEntries(
    [
        "adnbn",
        "adnbn/entry/background",
        "adnbn/entry/content",
        "adnbn/entry/content/react",
        "adnbn/entry/view/react",
        "adnbn/entry/view",
        "adnbn/locale",
        "adnbn/locale/react",
    ].map(name => [name + "$", fixtureRequire.resolve(name)])
);
const buildStats: RspackPluginInstance = {
    apply(compiler) {
        compiler.hooks.done.tap("verify-framework-modules", stats => {
            fs.mkdirSync("artifacts", {recursive: true});
            fs.writeFileSync(
                `artifacts/stats-${path.basename(compiler.options.output.path!)}.json`,
                JSON.stringify(
                    stats.toJson({
                        all: false,
                        orphanModules: true,
                        runtimeModules: true,
                        modules: true,
                        nestedModules: true,
                        assets: true,
                        entrypoints: true,
                        groupModulesByAttributes: false,
                        groupModulesByCacheStatus: false,
                        groupModulesByPath: false,
                        groupModulesByType: false,
                        modulesSpace: Infinity,
                    })
                )
            );
        });
    },
};

export default defineConfig({
    workspace: Workspace.Single,
    app: "shadow-ui",
    name: "Addon UI Shadow integration",
    version: "0.0.0",
    plugins: [ui()],
    bundler: () => ({
        resolve: {
            alias: {
                ...frameworkAliases,
                react: path.resolve("node_modules/react"),
                "react-dom": path.resolve("node_modules/react-dom"),
            },
        },
        plugins: [buildStats],
    }),
});
