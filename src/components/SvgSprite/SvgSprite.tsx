import React, {type FC, memo} from "react";

import type {SpriteIcons} from "../Icon";

import SvgSymbol from "./SvgSymbol";

export interface SvgSpriteProps {
    icons: SpriteIcons;
    /** Custom symbol IDs; defaults to the original icon names for standalone sprites. */
    getSymbolId?: (name: string) => string;
}

const SvgSprite: FC<SvgSpriteProps> = ({icons, getSymbolId}) => {
    return (
        <svg
            style={{position: "absolute", width: 0, height: 0, overflow: "hidden"}}
            aria-hidden="true" focusable="false"
        >
            <defs>
                {Object.entries(icons).map(([name, source]) => (
                    <SvgSymbol key={name} name={name} source={source} id={getSymbolId?.(name) ?? name} />
                ))}
            </defs>
        </svg>
    );
};

export default memo(SvgSprite);
