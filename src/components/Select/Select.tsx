import React, {type FC, memo, useState} from "react";

import {Root, type SelectProps} from "@radix-ui/react-select";

import {useLocale} from "adnbn/locale/react";

import {useComponentProps} from "../../providers";

import {SelectPortalContext} from "./context";
import {useSelectResize} from "./hooks/use-select-resize";

export {type SelectProps};

const Select: FC<SelectProps> = props => {
    const {open, defaultOpen, onOpenChange, children, ...other} = {...useComponentProps("select"), ...props};

    const {dir} = useLocale();

    const [requestedOpen, setRequestedOpen] = useState(defaultOpen ?? false);
    const [ready, setReady] = useState(false);
    const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
    const actualOpen = ready && (open ?? requestedOpen);
    const shouldIgnoreClose = useSelectResize(actualOpen, trigger?.ownerDocument.defaultView ?? null);

    return (
        <SelectPortalContext.Provider value={{open: actualOpen, setReady, setTrigger}}>
            <Root
                dir={dir}
                {...other}
                open={actualOpen}
                onOpenChange={value => {
                    if (shouldIgnoreClose(value)) {
                        return;
                    }

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
