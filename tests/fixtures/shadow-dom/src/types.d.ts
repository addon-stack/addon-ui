declare module "*.scss" {
    const styles: Record<string, string>;
    export default styles;
}

declare module "*.svg?react" {
    import type {ComponentProps, FC} from "react";

    const component: FC<ComponentProps<"svg">>;
    export default component;
}

declare module "*.svg" {
    const url: string;
    export default url;
}
