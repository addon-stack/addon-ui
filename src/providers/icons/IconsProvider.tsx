import React, {type FC, type PropsWithChildren, useCallback, useMemo, useState} from "react";

import {getIconDefinition, IconMode, type SpriteIcons} from "../../components/Icon";
import {SvgSprite} from "../../components/SvgSprite";
import type {Config} from "../../types/config";

import {IconRegistryContext, IconsContext} from "./context";
import {createSymbolPrefix, getSymbolId} from "./symbol-id";

const IconsProvider: FC<PropsWithChildren<Pick<Config, "icons">>> = ({children, icons}) => {
    const [prefix] = useState(createSymbolPrefix);
    const [registeredNames, setRegisteredNames] = useState(() => new Set<string>());
    const registeredIconNames = useMemo(() => Array.from(registeredNames), [registeredNames]);
    const resolveSymbolId = useCallback((name: string) => getSymbolId(prefix, name), [prefix]);

    const registerIcon = useCallback((name: string) => {
        setRegisteredNames(prev => (prev.has(name) ? prev : new Set(prev).add(name)));
    }, []);

    const registeredIcons = useMemo(() => {
        return registeredIconNames.reduce((acc, key) => {
            if (key in icons) {
                const definition = getIconDefinition(icons[key]);

                if (definition.mode === IconMode.Sprite) {
                    acc[key] = icons[key] as SpriteIcons[string];
                }
            }

            return acc;
        }, {} as SpriteIcons);
    }, [icons, registeredIconNames]);

    const registry = useMemo(() => ({icons, registerIcon, getSymbolId: resolveSymbolId}),
        [icons, registerIcon, resolveSymbolId]);

    const contract = useMemo(() => ({icons, registeredIconNames, registerIcon}),
        [icons, registeredIconNames, registerIcon]);

    return (
        <IconsContext.Provider value={contract}>
            <IconRegistryContext.Provider value={registry}>
                {children}
                <SvgSprite icons={registeredIcons} getSymbolId={resolveSymbolId} />
            </IconRegistryContext.Provider>
        </IconsContext.Provider>
    );
};

IconsProvider.displayName = "IconsProvider";

export default IconsProvider;
