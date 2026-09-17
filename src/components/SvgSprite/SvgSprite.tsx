import React, {type FC, memo} from "react";

import {getIconDefinition, IconMode, type SpriteIcons} from "../Icon/definition";

export interface SvgSpriteProps {
    icons: SpriteIcons;
}

const SvgSprite: FC<SvgSpriteProps> = ({icons}) => {
    return (
        <svg
            style={{position: "absolute", width: 0, height: 0, overflow: "hidden"}}
            aria-hidden="true" focusable="false"
        >
            <defs>
                {Object.entries(icons).map(([name, source]) => {
                    const definition = getIconDefinition(source);

                    if (definition.mode !== IconMode.Sprite) {
                        return null;
                    }

                    const Component = definition.component;

                    const viewBox = definition.viewBox ?? "0 0 24 24";
                    const isComponent = typeof source !== "object" || !("mode" in source);

                    return (
                        <symbol id={name} key={name} viewBox={viewBox}>
                            {isComponent ? <Component /> : (
                                <Component
                                    width="100%" height="100%"
                                    {...(definition.viewBox === undefined ? {} : {viewBox: definition.viewBox})}
                                />
                            )}
                        </symbol>
                    );
                })}
            </defs>
        </svg>
    );
};

export default memo(SvgSprite);
