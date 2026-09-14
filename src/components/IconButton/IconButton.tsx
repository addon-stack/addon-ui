import React, {memo, forwardRef, ForwardRefRenderFunction} from "react";
import classnames from "classnames";

import {Tooltip, TooltipProps} from "../Tooltip";
import {BaseButton, BaseButtonProps} from "../BaseButton";

import {useComponentProps} from "../../providers";

import {IconButtonVariant, IconButtonSize, IconButtonRadius} from "./types";

import styles from "./icon-button.module.scss?isolation";

export interface IconButtonProps extends BaseButtonProps {
    size?: IconButtonSize;
    radius?: IconButtonRadius;
    variant?: IconButtonVariant;
    tooltip?: Omit<TooltipProps, "children">;
}

const IconButton: ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (props, ref) => {
    const {size, radius, variant, tooltip, className, children, ...other} = {
        ...useComponentProps("iconButton"),
        ...props,
    };

    const iconButton = (
        <BaseButton
            ref={ref}
            {...other}
            className={classnames(
                styles["icon-button"],
                {
                    [styles[`icon-button--${variant}`]]: variant,
                    [styles[`icon-button--${size}-size`]]: size,
                    [styles[`icon-button--${radius}-radius`]]: radius,
                },
                className
            )}
        >
            {children}
        </BaseButton>
    );
    if (tooltip) {
        return <Tooltip {...tooltip}>{iconButton}</Tooltip>;
    }

    return iconButton;
};

export default memo(forwardRef(IconButton));
