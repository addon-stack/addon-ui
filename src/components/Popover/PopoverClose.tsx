import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {Close, type PopoverCloseProps} from "@radix-ui/react-popover";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import styles from "./popover.module.scss";

export type {PopoverCloseProps};

const PopoverClose: ForwardRefRenderFunction<HTMLButtonElement, PopoverCloseProps> = (props, ref) => {
    const {className, children, ...other} = {...useComponentProps("popoverClose"), ...props};

    return (
        <Close ref={ref} className={classnames(styles["popover__close"], className)} {...other}>
            {children}
        </Close>
    );
};

export default memo(forwardRef(PopoverClose));
