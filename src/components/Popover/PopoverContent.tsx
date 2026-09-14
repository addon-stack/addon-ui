import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {
    Arrow,
    Content,
    PopoverContentProps as PopoverContentRadixProps,
    PopoverPortalProps,
    Portal,
} from "@radix-ui/react-popover";

import {useComponentProps, usePortalContainer} from "../../providers";

import {FloatingLayerContext, useFloatingLayer, useFloatingFocus} from "../../hooks/floating";

import styles from "./popover.module.scss?isolation";

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
    const config = useComponentProps("popoverContent");
    const container = usePortalContainer(props.container, config?.container);
    const layer = useFloatingLayer({ref});
    const focus = useFloatingFocus(layer);
    const {
        maxWidth,
        minWidth,
        arrow,
        arrowWidth,
        arrowHeight,
        fullWidth,
        overlay,
        overlayClassname,
        className,
        style,
        children,
        onOpenAutoFocus,
        onKeyDown,
        container: _container,
        ...other
    } = {...config, ...props};
    if (container === null) return null;

    return (
        <Portal container={container}>
            <>
                {overlay && (
                    <div
                        className={classnames(styles["popover__overlay"], overlayClassname)}
                        style={{zIndex: layer.zIndex === undefined ? undefined : layer.zIndex - 1}}
                    />
                )}
                <Content
                    ref={focus.ref}
                    className={classnames(
                        styles["popover__content"],
                        {
                            [styles["popover__content--full-width"]]: fullWidth,
                        },
                        className
                    )}
                    {...other}
                    onOpenAutoFocus={event => {
                        onOpenAutoFocus?.(event);
                        focus.onOpenAutoFocus(event);
                    }}
                    onKeyDown={event => {
                        onKeyDown?.(event);
                        focus.onKeyDown(event);
                    }}
                    style={{
                        zIndex: layer.zIndex,
                        minWidth: minWidth ? minWidth : undefined,
                        maxWidth: maxWidth ? maxWidth : undefined,
                        ...style,
                    }}
                >
                    <FloatingLayerContext.Provider value={layer.layer}>{children}</FloatingLayerContext.Provider>
                    {arrow && <Arrow className={styles["popover__arrow"]} width={arrowWidth} height={arrowHeight} />}
                </Content>
            </>
        </Portal>
    );
};

export default memo(forwardRef(PopoverContent));
