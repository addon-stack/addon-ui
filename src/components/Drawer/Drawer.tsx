import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {cloneOrCreateElement} from "../../utils";
import {Dialog, type DialogProps, DialogPropsKeys} from "../Dialog";

import {DrawerSide} from "./types";

import styles from "./drawer.module.scss?isolation";

export interface DrawerProps extends DialogProps {
    side?: DrawerSide;
}

export const DrawerPropsKeys = new Set<keyof DrawerProps>(["side", ...DialogPropsKeys]);

const Drawer: ForwardRefRenderFunction<HTMLDivElement, DrawerProps> = (props, ref) => {
    const config = useComponentProps("drawer");

    const {
        side = DrawerSide.Left,
        fullscreen,
        children,
        className,
        overlayClassName,
        childrenClassName,
        container = config?.container,
        ...other
    } = {...config, ...props};

    return (
        <Dialog
            ref={ref}
            {...other}
            container={container}
            overlayClassName={classnames(styles["drawer-overlay"], overlayClassName)}
            className={classnames(
                styles["drawer-content"],
                {
                    [styles["drawer-content--fullscreen"]]: fullscreen,
                    [styles[`drawer-content--${side}-side`]]: side,
                },
                className
            )}
        >
            {cloneOrCreateElement(
                children,
                {className: classnames(styles["drawer-children"], childrenClassName)},
                "div"
            )}
        </Dialog>
    );
};

export default memo(forwardRef(Drawer));
