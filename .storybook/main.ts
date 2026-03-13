import path from "path";
import {merge} from "webpack-merge";
import type {StorybookConfig} from "storybook-react-rsbuild";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    framework: "storybook-react-rsbuild",
    rsbuildFinal: async config => {
        const {pluginSass} = await import("@rsbuild/plugin-sass");

        return merge(config, {
            plugins: [pluginSass()],
            resolve: {
                alias: {
                    "addon-ui-config": path.resolve("src", "config", "default.ts"),
                    "addon-ui-style.scss": path.resolve("src", "providers", "ui", "styles", "default.scss"),
                },
            },
        });
    },
};

export default config;
