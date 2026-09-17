import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {Root, type ToggleGroupMultipleProps, type ToggleGroupSingleProps} from "@radix-ui/react-toggle-group";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import styles from "./toggle-group.module.scss";

export type {ToggleGroupMultipleProps, ToggleGroupSingleProps};

export type ToggleGroupProps = React.ComponentProps<typeof Root>;

const ToggleGroup: ForwardRefRenderFunction<HTMLDivElement, ToggleGroupProps> = (props, ref) => {
    const {className, children, ...other} = {...useComponentProps("toggleGroup"), ...props};

    return (
        <Root ref={ref} className={classnames(styles["toggle-group"], className)} {...other}>
            {children}
        </Root>
    );
};

export default memo(forwardRef(ToggleGroup));
