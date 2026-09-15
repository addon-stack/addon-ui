import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {BaseButton, type BaseButtonProps} from "../BaseButton";

import {type ButtonColor, type ButtonRadius, type ButtonSize, ButtonVariant} from "./types";

import styles from "./button.module.scss?isolation";

export interface ButtonProps extends BaseButtonProps {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    radius?: ButtonRadius;
}

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (props, ref) => {
    const {
        variant = ButtonVariant.Contained,
        color,
        size,
        radius,
        childrenClassName,
        className,
        children,
        ...other
    } = {...useComponentProps("button"), ...props};

    return (
        <BaseButton
            ref={ref}
            {...other}
            className={classnames(
                styles["button"],
                {
                    [styles[`button--${variant}`]]: variant,
                    [styles[`button--${radius}-radius`]]: radius,
                    [styles[`button--${color}-color`]]: color,
                    [styles[`button--${size}-size`]]: size,
                },
                className
            )}
            childrenClassName={classnames(styles["button__children"], childrenClassName)}
        >
            {children}
        </BaseButton>
    );
};

export default memo(forwardRef(Button));
