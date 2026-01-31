import path from "path";
import {definePlugin} from "adnbn";
import {Configuration as Rspack} from "@rspack/core";
import {RspackVirtualModulePlugin} from "rspack-plugin-virtual-module";

import StyleBuilder from "./builder/StyleBuilder";
import ConfigBuilder from "./builder/ConfigBuilder";

import Finder from "./finder/Finder";
import StyleFinder from "./finder/StyleFinder";
import ConfigFinder from "./finder/ConfigFinder";

import type {BuilderContract} from "./types";

export interface PluginOptions {
    themeDir?: string;
    configName?: string;
    styleName?: string;
    mergeConfig?: boolean;
    mergeStyles?: boolean;
}

export default definePlugin((options: PluginOptions = {}) => {
    const {
        themeDir = ".",
        configName = "config.ui",
        styleName = "style.ui",
        mergeConfig = true,
        mergeStyles = true,
    } = options;

    let configFinder: Finder;
    let styleFinder: Finder;

    let configBuilder: BuilderContract;
    let styleBuilder: BuilderContract;

    return {
        name: "addon-ui",
        startup: ({config}) => {
            const {srcDir, appsDir, sharedDir, app, appSrcDir} = config;
            const normalizeThemeDir = path.normalize(themeDir).split(path.sep);

            // Elements should be arranged in descending order of priority
            const searchDirs = [
                path.join(srcDir, appsDir, app, appSrcDir, ...normalizeThemeDir),
                path.join(srcDir, sharedDir, ...normalizeThemeDir),
            ];

            configFinder = new ConfigFinder(configName, config).setCanMerge(mergeConfig).setSearchDirs(searchDirs);
            styleFinder = new StyleFinder(styleName, config).setCanMerge(mergeStyles).setSearchDirs(searchDirs);

            configBuilder = new ConfigBuilder(configFinder);
            styleBuilder = new StyleBuilder(styleFinder);
        },
        bundler: () => {
            return {
                plugins: [
                    new RspackVirtualModulePlugin(
                        {
                            "addon-ui-config": configBuilder.build(),
                            "addon-ui-style.scss": styleBuilder.build(),
                        },
                        "addon-ui-virtual"
                    ),
                ],
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            addonUI: {
                                test: (module: any) => {
                                    const resource =
                                        module.resource ||
                                        (typeof module.nameForCondition === "function"
                                            ? module.nameForCondition()
                                            : "");

                                    if (!resource) {
                                        return false;
                                    }

                                    // Обработка виртуальных модулей (конфиг и базовые стили)
                                    if (
                                        resource.includes("addon-ui-virtual") ||
                                        resource.includes("addon-ui-style.scss") ||
                                        resource.includes("addon-ui-config") ||
                                        /providers[\\/]ui[\\/]styles/.test(resource)
                                    ) {
                                        return true;
                                    }

                                    const isComponent = /src[\\/]components[\\/]/.test(resource);

                                    if (isComponent) {
                                        if (resource.includes("node_modules")) {
                                            return resource.includes("addon-ui");
                                        }

                                        return true;
                                    }

                                    return /node_modules[\\/](@radix-ui|radix-ui|autosize|odometer|react-highlight-words|react-responsive-overflow-list)/.test(
                                        resource
                                    );
                                },
                                name(module: any) {
                                    const resource =
                                        module.resource ||
                                        (typeof module.nameForCondition === "function"
                                            ? module.nameForCondition()
                                            : "");

                                    const extractName = (res: string) => {
                                        if (!res) return null;

                                        const match = res.match(/src[\\/]components[\\/]([^\\/]+)/);

                                        if (match && match[1] && !match[1].includes(".") && match[1] !== "index") {
                                            const name = match[1].toLowerCase();

                                            if (["button", "basebutton", "iconbutton"].includes(name)) {
                                                return "button";
                                            }

                                            return name;
                                        }

                                        return null;
                                    };

                                    const directName = extractName(resource);

                                    if (directName) {
                                        return `ui-${directName}`;
                                    }

                                    if (
                                        resource.includes("addon-ui-virtual") ||
                                        resource.includes("addon-ui-style.scss") ||
                                        resource.includes("addon-ui-config") ||
                                        /providers[\\/]ui[\\/]styles/.test(resource)
                                    ) {
                                        return "ui-base";
                                    }

                                    if (resource.includes("node_modules")) {
                                        if (resource.includes("radix-ui")) {
                                            const match = resource.match(/@radix-ui[\\/]react-([^\\/]+)/);

                                            if (match) {
                                                const radixName = match[1];

                                                const mainRadixComponents = [
                                                    "accordion",
                                                    "avatar",
                                                    "checkbox",
                                                    "dialog",
                                                    "dropdown-menu",
                                                    "popover",
                                                    "scroll-area",
                                                    "select",
                                                    "switch",
                                                    "tabs",
                                                    "toast",
                                                    "tooltip",
                                                ];

                                                if (mainRadixComponents.includes(radixName)) {
                                                    return `ui-${radixName.replace(/-/g, "")}`;
                                                }
                                            }

                                            return "ui-common";
                                        }

                                        if (resource.includes("odometer")) {
                                            return "ui-odometer";
                                        }

                                        if (resource.includes("autosize")) {
                                            return "ui-textarea";
                                        }

                                        if (resource.includes("react-highlight-words")) {
                                            return "ui-highlight";
                                        }

                                        if (resource.includes("react-responsive-overflow-list")) {
                                            return "ui-truncatelist";
                                        }
                                    }

                                    let issuer = module.issuer;

                                    while (issuer) {
                                        const nameFromIssuer = extractName(issuer.resource || "");

                                        if (nameFromIssuer) {
                                            return `ui-${nameFromIssuer}`;
                                        }

                                        issuer = issuer.issuer;
                                    }

                                    return "ui-common";
                                },
                                chunks: "all",
                                enforce: true,
                                priority: 30,
                            },
                        },
                    },
                },
            } satisfies Rspack;
        },
        manifest: ({manifest}) => {
            manifest.addPermission("storage");
        },
    };
});
