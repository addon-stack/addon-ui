import React, {type ComponentProps, forwardRef, type JSX, memo, type ReactNode} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {cloneOrCreateElement} from "../../utils";

import styles from "./list-item.module.scss?isolation";

type TagType = keyof JSX.IntrinsicElements;
export type ListItemType = HTMLLIElement;

export interface ListItemProps extends ComponentProps<"li"> {
    left?: ReactNode;
    right?: ReactNode;
    primary?: ReactNode;
    secondary?: ReactNode;
    leftTag?: TagType;
    rightTag?: TagType;
    primaryTag?: TagType;
    secondaryTag?: TagType;
    primaryClassName?: string;
    secondaryClassName?: string;
    centerClassName?: string;
    leftClassName?: string;
    rightClassName?: string;
}

const ListItem = forwardRef<ListItemType, ListItemProps>((props, ref) => {
    const {
        left,
        right,
        primary,
        secondary,
        leftTag = "div",
        rightTag = "div",
        primaryTag = "div",
        secondaryTag = "div",
        children,
        className,
        leftClassName,
        rightClassName,
        centerClassName,
        primaryClassName,
        secondaryClassName,
        role = "list-item",
        ...other
    } = {...useComponentProps("listItem"), ...props};

    return (
        <li {...other} ref={ref} role={role} className={classnames(styles["list-item"], className)}>
            {cloneOrCreateElement(left, {className: classnames(styles["list-item__left"], leftClassName)}, leftTag)}

            {(primary || secondary) && (
                <div className={classnames(styles["list-item__center"], centerClassName)}>
                    {cloneOrCreateElement(
                        primary,
                        {className: classnames(styles["list-item__primary"], primaryClassName)},
                        primaryTag
                    )}
                    {cloneOrCreateElement(
                        secondary,
                        {className: classnames(styles["list-item__secondary"], secondaryClassName)},
                        secondaryTag
                    )}
                </div>
            )}

            {cloneOrCreateElement(right, {className: classnames(styles["list-item__right"], rightClassName)}, rightTag)}

            {children}
        </li>
    );
});

export default memo(ListItem);
