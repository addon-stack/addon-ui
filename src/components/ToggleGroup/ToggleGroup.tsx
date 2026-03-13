import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {Root, ToggleGroupMultipleProps, ToggleGroupSingleProps} from "@radix-ui/react-toggle-group";

import {useComponentProps} from "../../providers";

import styles from "./toggleGroup.module.scss";

export type {ToggleGroupSingleProps, ToggleGroupMultipleProps};

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
