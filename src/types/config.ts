import type {SvgSpriteProps} from "../components";
import type {ComponentsProps} from "../components/types";

export type {ComponentsProps};

export type Icons = SvgSpriteProps["icons"];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtraProps {}

export interface Config {
    components: ComponentsProps;
    extra: ExtraProps;
    icons: Icons;
}
