import {createContext} from "react";

export interface FloatingLayer {
    node: HTMLElement | null;
    parent: FloatingLayer | null;
    active: boolean;
    modal: boolean;
    order: number;
    zIndex: number;
}

export const FloatingLayerContext = createContext<FloatingLayer | null>(null);
