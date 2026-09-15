import React, {type FC, type PropsWithChildren} from "react";

import type {Config} from "../../types/config";

import {ExtraContext} from "./context";

const ExtraProvider: FC<PropsWithChildren<Pick<Config, "extra">>> = ({children, extra}) => {
    return <ExtraContext.Provider value={{extra}}>{children}</ExtraContext.Provider>;
};

ExtraProvider.displayName = "ExtraProvider";

export default ExtraProvider;
