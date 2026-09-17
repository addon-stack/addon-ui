import {createContext, useContext} from "react";

import type {Icons} from "../../components";

export interface IconsContract {
    icons: Icons;
    registeredIconNames: string[];
    registerIcon: (name: string) => void;
}

export const IconsContext = createContext<IconsContract>({
    icons: {},

    registeredIconNames: [],

    registerIcon: () => {},
});

IconsContext.displayName = "IconsContext";

export const useIcons = () => useContext(IconsContext);

export interface IconRegistryContract {
    icons: Icons;
    registerIcon: (name: string) => void;
    getSymbolId: (name: string) => string;
}

export const IconRegistryContext = createContext<IconRegistryContract>({
    icons: {},
    registerIcon: () => {},
    getSymbolId: name => name,
});

IconRegistryContext.displayName = "IconRegistryContext";

export const useIconRegistry = () => useContext(IconRegistryContext);
