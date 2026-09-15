import type {Configuration as Rspack} from "@rspack/core";
import {definePlugin} from "adnbn";
import path from "path";

import {ConfigBuilder, StyleBuilder} from "./builder";
import {StyleResourcesPlugin, VirtualSourcePlugin} from "./bundler";
import {ConfigFinder, StyleFinder} from "./finder";

const PluginName = "addon-ui";
const ConfigModuleName = `#${PluginName}/config`;
const StyleModuleName = `#${PluginName}/style.scss`;

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

    return {
        name: PluginName,
        bundler: ({config}) => {
            const {srcDir, appsDir, sharedDir, app, appSrcDir} = config;
            const normalizeThemeDir = path.normalize(themeDir).split(path.sep);

            // Elements should be arranged in descending order of priority
            const searchDirs = [
                path.join(srcDir, appsDir, app, appSrcDir, ...normalizeThemeDir),
                path.join(srcDir, sharedDir, ...normalizeThemeDir),
            ];

            const configFinder = new ConfigFinder(configName, config)
                .setCanMerge(mergeConfig)
                .setSearchDirs(searchDirs);

            const styleFinder = new StyleFinder(styleName, config).setCanMerge(mergeStyles).setSearchDirs(searchDirs);

            const configBuilder = new ConfigBuilder(configFinder);
            const styleBuilder = new StyleBuilder(styleFinder);

            return {
                plugins: [
                    new VirtualSourcePlugin({
                        modules: [ConfigModuleName, StyleModuleName],
                        generate: () => ({
                            [ConfigModuleName]: configBuilder.build(),
                            [StyleModuleName]: styleBuilder.build(),
                        }),
                        dependencies: () => ({
                            files: [...configFinder.getFiles(), ...styleFinder.getFiles()].map(file => file.import),
                            directories: [...configFinder.getDirectories(), ...styleFinder.getDirectories()],
                        }),
                    }),
                    new StyleResourcesPlugin(StyleModuleName),
                ],
            } satisfies Rspack;
        },
        manifest: ({manifest}) => {
            manifest.addPermission("storage");
        },
    };
});
