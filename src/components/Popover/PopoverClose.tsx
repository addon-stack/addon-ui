import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {Close, PopoverCloseProps} from "@radix-ui/react-popover";

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
