import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {ToggleGroupItem as ToggleGroupItemRadix, type ToggleGroupItemProps} from "@radix-ui/react-toggle-group";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

export type {ToggleGroupItemProps};

import styles from "./toggle-group.module.scss?isolation";

const ToggleGroupItem: ForwardRefRenderFunction<HTMLButtonElement, ToggleGroupItemProps> = (props, ref) => {
    const {asChild = true, children, className, ...other} = {...useComponentProps("toggleGroupItem"), ...props};

    return (
        <ToggleGroupItemRadix
            {...other}
            ref={ref}
            asChild={asChild}
            className={classnames(styles["toggle-group__item"], className)}
        >
            {children}
        </ToggleGroupItemRadix>
    );
};

export default memo(forwardRef(ToggleGroupItem));
