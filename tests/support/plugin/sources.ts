import type {ReadonlyConfig} from "adnbn";

import {ConfigBuilder, StyleBuilder} from "../../../src/plugin/builder";
import {StyleResourcesPlugin, VirtualSourcePlugin} from "../../../src/plugin/bundler";
import {ConfigFinder, StyleFinder} from "../../../src/plugin/finder";

export const createSources = (root: string, merge = true) => {
    const config = {rootDir: root} as ReadonlyConfig;
    // Deliberately include spaces/punctuation and a duplicate path.
    const dirs = ["app theme.v2", "shared", "shared"];
    const configFinder = new ConfigFinder("ui.config", config).setSearchDirs(dirs).setCanMerge(merge);
    const styleFinder = new StyleFinder("ui.style", config).setSearchDirs(dirs).setCanMerge(merge);
    const configBuilder = new ConfigBuilder(configFinder);
    const styleBuilder = new StyleBuilder(styleFinder);

    return [new VirtualSourcePlugin({
        modules: ["#addon-ui/config", "#addon-ui/style.scss"],
        generate: () => ({
            "#addon-ui/config": configBuilder.build(),
            "#addon-ui/style.scss": styleBuilder.build(),
        }),
        dependencies: () => ({
            files: [...configFinder.getFiles(), ...styleFinder.getFiles()].map(file => file.import),
            directories: [...configFinder.getDirectories(), ...styleFinder.getDirectories()],
        }),
    }), new StyleResourcesPlugin("#addon-ui/style.scss")];
};
