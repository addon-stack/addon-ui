import type {ComponentsProps, Config, ExtraProps} from "../types/config";

export type {ComponentsProps, Config, ExtraProps};

export const defineConfig = (config: Partial<Config>): Config => {
    const {components = {}, extra = {}, icons = {}} = config;

    return {components, extra, icons};
};
