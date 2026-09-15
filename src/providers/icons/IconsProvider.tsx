import React, {type FC, type PropsWithChildren, useCallback, useMemo, useState} from "react";

import {SvgSprite} from "../../components/SvgSprite";
import type {Config, Icons} from "../../types/config";

import {IconsContext} from "./context";

const IconsProvider: FC<PropsWithChildren<Pick<Config, "icons">>> = ({children, icons}) => {
    const [registeredIconNames, setRegisteredIconNames] = useState<string[]>([]);

    const registerIcon = useCallback((name: string) => {
        setRegisteredIconNames(prev => (prev.includes(name) ? prev : [...prev, name]));
    }, []);

    const registeredIcons = useMemo(() => {
        return registeredIconNames.reduce((acc, key) => {
            if (key in icons) {
                acc[key] = icons[key];
            }

            return acc;
        }, {} as Icons);
    }, [icons, registeredIconNames]);

    return (
        <IconsContext.Provider value={{icons, registeredIconNames, registerIcon}}>
            {children}
            <SvgSprite icons={registeredIcons} />
        </IconsContext.Provider>
    );
};

IconsProvider.displayName = "IconsProvider";

export default IconsProvider;
