import {type IconDefinition, IconMode, type IconSource} from "./types";

export const getIconDefinition = (source: IconSource): IconDefinition => {
    if (typeof source === "object" && "mode" in source) {
        return source;
    }

    return {mode: IconMode.Sprite, component: source};
};
