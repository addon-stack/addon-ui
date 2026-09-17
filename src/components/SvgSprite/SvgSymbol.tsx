import React, {type FC, memo} from "react";

import {getIconDefinition, IconMode, type SpriteIcons} from "../Icon";

interface SvgSymbolProps {
    id: string;
    name: string;
    source: SpriteIcons[string];
}

const SvgSymbol: FC<SvgSymbolProps> = ({id, name, source}) => {
    const definition = getIconDefinition(source);

    if (definition.mode !== IconMode.Sprite) {
        return null;
    }

    const Component = definition.component;
    const viewBox = definition.viewBox ?? "0 0 24 24";
    const isComponent = typeof source !== "object" || !("mode" in source);

    return (
        <symbol id={id} data-icon={name} viewBox={viewBox}>
            {isComponent ? <Component /> : (
                <Component
                    width="100%" height="100%"
                    {...(definition.viewBox === undefined ? {} : {viewBox: definition.viewBox})}
                />
            )}
        </symbol>
    );
};

export default memo(SvgSymbol);
