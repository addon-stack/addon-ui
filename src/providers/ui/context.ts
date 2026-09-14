import {createContext, useContext} from "react";

export type PortalContainer = Element | DocumentFragment | null;

export const PortalContext = createContext<PortalContainer | undefined>(undefined);

/** Undefined inherits the next level; null deliberately waits for a target. */
export function usePortalContainer(prop: PortalContainer | undefined, config: PortalContainer | undefined) {
    const portal = useContext(PortalContext);
    return prop !== undefined ? prop : config !== undefined ? config : portal;
}
