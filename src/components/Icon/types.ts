import type {ComponentProps, ComponentType} from "react";

export enum IconMode {
    Sprite = "sprite",
    Inline = "inline",
    Asset = "asset",
}

export type IconComponent = ComponentType<ComponentProps<"svg">>;

export interface SpriteIconDefinition {
    mode: `${IconMode.Sprite}`;
    component: IconComponent;
    viewBox?: string;
    src?: never;
}

export interface InlineIconDefinition {
    mode: `${IconMode.Inline}`;
    component: IconComponent;
    viewBox?: string;
    src?: never;
}

export interface AssetIconDefinition {
    mode: `${IconMode.Asset}`;
    src: string;
    component?: never;
    viewBox?: never;
}

export type IconDefinition = SpriteIconDefinition | InlineIconDefinition | AssetIconDefinition;
export type IconSource = IconComponent | IconDefinition;
export type IconMap = Record<string, IconSource>;
export type SpriteIcons = Record<string, IconComponent | SpriteIconDefinition>;
