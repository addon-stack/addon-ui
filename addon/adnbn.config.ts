import {defineConfig} from "adnbn";
import ui from "addon-ui/plugin";

export default defineConfig({
    workspace: 'multi',
    plugins: [ui({
        themeDir: 'theme',
        configName: 'theme.ts',
        mergeConfig: true
    })],
    htmlDir: 'html',
    name: 'Addon UI',
    jsFilename: '[name].js',
    cssFilename: '[name].css',
    cssIdentName: '[local]',
    description: 'Addon UI test addon'
});
