import React, {type FC, memo} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {Header, type HeaderProps} from "../Header";

import styles from "./view.module.scss?isolation";

export interface ViewProps extends HeaderProps {
    center?: boolean;
    showSeparate?: boolean;
    bodyClassName?: string;
    headerClassName?: string;
}

export const ViewPropsKeys = new Set<keyof ViewProps>([
    // View keys
    "center",
    "showSeparate",
    "bodyClassName",
    "headerClassName",
    "children",

    // Header keys
    "title",
    "before",
    "after",
    "subtitle",
    "wrapClassName",
    "titleClassName",
    "beforeClassName",
    "afterClassName",
    "subtitleClassName",
    "alignCenter",
]);

const View: FC<ViewProps> = props => {
    const {center, showSeparate, className, bodyClassName, headerClassName, children, ...other} = {
        ...useComponentProps("view"),
        ...props,
    };

    return (
        <div
            className={classnames(
                styles["view"],
                {
                    [styles["view--center"]]: center,
                },
                className
            )}
        >
            <Header
                className={classnames(
                    styles["view-header"],
                    {
                        [styles[`view-header--separate`]]: showSeparate,
                    },
                    headerClassName
                )}
                {...other}
            />
            <div className={classnames(styles["view-body"], bodyClassName)}>{children}</div>
        </div>
    );
};

export default memo(View);
