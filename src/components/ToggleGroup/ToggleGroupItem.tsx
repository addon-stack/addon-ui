import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {ToggleGroupItem as ToggleGroupItemRadix, ToggleGroupItemProps} from "@radix-ui/react-toggle-group";

import {useComponentProps} from "../../providers";

export type {ToggleGroupItemProps};

import styles from "./toggleGroup.module.scss";

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
