import path from "path";
import {definePlugin} from "adnbn";
import type {Configuration as Rspack} from "@rspack/core";
import {RspackVirtualModulePlugin} from "rspack-plugin-virtual-module";

import StyleBuilder from "./builder/StyleBuilder";
import ConfigBuilder from "./builder/ConfigBuilder";

import Finder from "./finder/Finder";
import StyleFinder from "./finder/StyleFinder";
import ConfigFinder from "./finder/ConfigFinder";

import type {BuilderContract} from "./types";

export interface PluginOptions {
    /**
     * Directory path where plugin configuration and style files are located, relative to the project root.
     * @default "."
     */
    themeDir?: string;

    /**
     * Name of the configuration file.
     * @default "ui.config"
     */
    configName?: string;

    /**
     * Name of the style file.
     * @default "ui.style"
     */
    styleName?: string;

    /**
     * Whether to merge configuration files from different app directories.
     * @default true
     */
    mergeConfig?: boolean;

    /**
     * Whether to merge style files from different app directories.
     * @default true
     */
    mergeStyles?: boolean;
}

export default definePlugin((options: PluginOptions = {}) => {
    const {
        themeDir = ".",
        configName = "ui.config",
        styleName = "ui.style",
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
            } satisfies Rspack;
        },
        manifest: ({manifest}) => {
            manifest.addPermission("storage");
        },
    };
});
