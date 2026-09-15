import {createContext, useContext} from "react";

import type {ExtraProps} from "../../types/config";

export interface ExtraContract {
    extra: ExtraProps;
}

export const ExtraContext = createContext<ExtraContract>({
    extra: {},
});

ExtraContext.displayName = "ExtraContext";

export const useExtra = () => useContext(ExtraContext).extra;
