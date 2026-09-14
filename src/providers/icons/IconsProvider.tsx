import React, {FC, PropsWithChildren, useCallback, useMemo, useState} from "react";

import {IconsContext} from "./context";
import {SvgSprite} from "../../components/SvgSprite";

import {Config, Icons} from "../../types/config";

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
