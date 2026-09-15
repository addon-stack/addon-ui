import React, {type ComponentProps, type FC, memo} from "react";

export interface SvgSpriteProps {
    icons: Record<string, FC<ComponentProps<"svg">>>;
}

const SvgSprite: FC<SvgSpriteProps> = ({icons}) => {
    return (
        <svg style={{display: "none"}} aria-hidden="true">
            <defs>
                {Object.entries(icons).map(([name, Icon]) => (
                    <symbol id={name} key={name} viewBox="0 0 24 24">
                        <Icon />
                    </symbol>
                ))}
            </defs>
        </svg>
    );
};

export default memo(SvgSprite);
