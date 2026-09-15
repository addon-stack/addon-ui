import type {StorybookConfig} from "storybook-react-rsbuild";
import {merge} from "webpack-merge";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    framework: "storybook-react-rsbuild",
    rsbuildFinal: async config => {
        const {pluginSass} = await import("@rsbuild/plugin-sass");

        return merge(config, {
            plugins: [pluginSass()],
        });
    },
};

export default config;
