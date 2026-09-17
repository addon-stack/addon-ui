import React, {type FC, type PropsWithChildren, useMemo} from "react";

import type {Config} from "../../types/config";

import {ExtraContext} from "./context";

const ExtraProvider: FC<PropsWithChildren<Pick<Config, "extra">>> = ({children, extra}) => {
    const contract = useMemo(() => ({extra}), [extra]);

    return <ExtraContext.Provider value={contract}>{children}</ExtraContext.Provider>;
};

ExtraProvider.displayName = "ExtraProvider";

export default ExtraProvider;
