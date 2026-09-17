import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {Anchor, type PopoverAnchorProps} from "@radix-ui/react-popover";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import styles from "./popover.module.scss";

export type {PopoverAnchorProps};

const PopoverAnchor: ForwardRefRenderFunction<HTMLDivElement, PopoverAnchorProps> = (props, ref) => {
    const {className, children, ...other} = {...useComponentProps("popoverAnchor"), ...props};

    return (
        <Anchor ref={ref} className={classnames(styles["popover__anchor"], className)} {...other}>
            {children}
        </Anchor>
    );
};

export default memo(forwardRef(PopoverAnchor));
