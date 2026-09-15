import {createContext, type KeyboardEvent} from "react";

export const SelectPortalContext = createContext({
    open: false,
    setReady: (() => {}) as (ready: boolean) => void,
    setTrigger: (() => {}) as (trigger: HTMLButtonElement | null) => void,
});

export const SelectTypeaheadContext = createContext<((event: KeyboardEvent<HTMLDivElement>) => void) | undefined>(
    undefined
);
