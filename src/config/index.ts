import type {ComponentsProps, Config, ExtraProps, Icons} from "../types/config";

export type {ComponentsProps, Config, ExtraProps, Icons};

export const defineConfig = (config: Partial<Config>): Config => {
    const {components = {}, extra = {}, icons = {}} = config;

    return {components, extra, icons};
};
