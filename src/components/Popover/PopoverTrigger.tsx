import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {PopoverTriggerProps as PopoverTriggerRadixProps, Trigger} from "@radix-ui/react-popover";

import {useComponentProps} from "../../providers";

import styles from "./popover.module.scss";

export interface PopoverTriggerProps extends PopoverTriggerRadixProps {
    center?: boolean;
}

const PopoverTrigger: ForwardRefRenderFunction<HTMLButtonElement, PopoverTriggerProps> = (props, ref) => {
    const {center, className, children, ...other} = {...useComponentProps("popoverTrigger"), ...props};

    return (
        <Trigger
            ref={ref}
            className={classnames(
                styles["popover__trigger"],
                {
                    [styles["popover__trigger--center"]]: center,
                },
                className
            )}
            {...other}
        >
            {children}
        </Trigger>
    );
};

export default memo(forwardRef(PopoverTrigger));
