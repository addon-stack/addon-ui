import React, {type ComponentProps, forwardRef, type ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import {type TagColor, type TagRadius, type TagSize, TagVariant} from "./types";

import styles from "./tag.module.scss";

export interface TagProps extends ComponentProps<"span"> {
    size?: TagSize;
    color?: TagColor;
    radius?: TagRadius;
    variant?: TagVariant;
    clickable?: boolean;
}

const Tag: ForwardRefRenderFunction<HTMLSpanElement, TagProps> = (props, ref) => {
    const {
        size,
        color,
        radius,
        variant = TagVariant.Contained,
        clickable,
        children,
        className,
        ...other
    } = {...useComponentProps("tag"), ...props};

    return (
        <span
            ref={ref}
            {...other}
            className={classnames(
                styles["tag"],
                {
                    [styles[`tag--${variant}`]]: variant,
                    [styles[`tag--${radius}-radius`]]: radius,
                    [styles[`tag--${color}-color`]]: color,
                    [styles[`tag--${size}-size`]]: size,
                    [styles["tag--clickable"]]: clickable,
                },
                className
            )}
        >
            {children}
        </span>
    );
};

export default memo(forwardRef(Tag));
