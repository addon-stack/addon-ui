import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {
    Arrow,
    Content,
    PopoverContentProps as PopoverContentRadixProps,
    PopoverPortalProps,
    Portal,
} from "@radix-ui/react-popover";

import {useComponentProps} from "../../providers";

import styles from "./popover.module.scss";

export interface PopoverContentProps extends PopoverContentRadixProps, PopoverPortalProps {
    maxWidth?: number;
    minWidth?: number;
    fullWidth?: boolean;
    arrow?: boolean;
    arrowWidth?: number;
    arrowHeight?: number;
    overlay?: boolean;
    overlayClassname?: string;
}

const PopoverContent: ForwardRefRenderFunction<HTMLDivElement, PopoverContentProps> = (props, ref) => {
    const {
        maxWidth,
        minWidth,
        arrow,
        arrowWidth,
        arrowHeight,
        fullWidth,
        overlay,
        overlayClassname,
        container,
        className,
        style,
        children,
        ...other
    } = {...useComponentProps("popoverContent"), ...props};

    return (
        <Portal container={container}>
            <>
                {overlay && <div className={classnames(styles["popover__overlay"], overlayClassname)} />}
                <Content
                    ref={ref}
                    className={classnames(
                        styles["popover__content"],
                        {
                            [styles["popover__content--full-width"]]: fullWidth,
                        },
                        className
                    )}
                    {...other}
                    style={{
                        minWidth: minWidth ? minWidth : undefined,
                        maxWidth: maxWidth ? maxWidth : undefined,
                        ...style,
                    }}
                >
                    {children}
                    {arrow && <Arrow className={styles["popover__arrow"]} width={arrowWidth} height={arrowHeight} />}
                </Content>
            </>
        </Portal>
    );
};

export default memo(forwardRef(PopoverContent));
