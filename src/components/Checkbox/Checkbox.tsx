import React, {memo, ReactElement, forwardRef, ForwardRefRenderFunction} from "react";
import classnames from "classnames";
import {CheckboxProps as CheckboxRootProps, Indicator, Root} from "@radix-ui/react-checkbox";

import {useComponentProps} from "../../providers";

import {CheckboxVariant, CheckboxSize, CheckboxRadius} from "./types";

import styles from "./checkbox.module.scss?isolation";

export type {CheckedState} from "@radix-ui/react-checkbox";

export interface CheckboxProps extends CheckboxRootProps {
    indicatorClassName?: string;
    size?: CheckboxSize;
    radius?: CheckboxRadius;
    variant?: CheckboxVariant;
    checkedIcon?: ReactElement;
    indeterminateIcon?: ReactElement;
}

const Checkbox: ForwardRefRenderFunction<HTMLButtonElement, CheckboxProps> = (props, ref) => {
    const {
        checked,
        size,
        radius,
        variant,
        className,
        indicatorClassName,
        checkedIcon = "✔",
        indeterminateIcon = "―",
        ...other
    } = {...useComponentProps("checkbox"), ...props};

    return (
        <Root
            ref={ref}
            {...other}
            checked={checked}
            className={classnames(
                styles["checkbox"],
                {
                    [styles[`checkbox--${variant}`]]: variant,
                    [styles[`checkbox--${radius}-radius`]]: radius,
                    [styles[`checkbox--${size}-size`]]: size,
                },
                className
            )}
        >
            <Indicator className={classnames(styles["checkbox__indicator"], indicatorClassName)}>
                {checked === "indeterminate" && indeterminateIcon}
                {checked === true && checkedIcon}
            </Indicator>
        </Root>
    );
};

export default memo(forwardRef(Checkbox));
