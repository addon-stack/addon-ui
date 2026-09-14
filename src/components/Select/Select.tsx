import React, {FC, memo, useState} from "react";

import {useLocale} from "adnbn/locale/react";

import {Root, SelectProps} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import {SelectPortalContext} from "./context";

export {type SelectProps};

const Select: FC<SelectProps> = props => {
    const {open, defaultOpen, onOpenChange, children, ...other} = {...useComponentProps("select"), ...props};

    const {dir} = useLocale();

    const [requestedOpen, setRequestedOpen] = useState(defaultOpen ?? false);
    const [ready, setReady] = useState(false);
    const actualOpen = ready && (open ?? requestedOpen);

    return (
        <SelectPortalContext.Provider value={{open: actualOpen, setReady}}>
            <Root
                dir={dir}
                {...other}
                open={actualOpen}
                onOpenChange={value => {
                    setRequestedOpen(value);
                    onOpenChange?.(value);
                }}
            >
                {children}
            </Root>
        </SelectPortalContext.Provider>
    );
};

export default memo(Select);
