import React, {forwardRef, ForwardRefRenderFunction, memo, useImperativeHandle} from "react";
import classnames from "classnames";
import {
    Corner,
    Root,
    ScrollAreaProps as ScrollAreaRootProps,
    Scrollbar,
    Thumb,
    Viewport,
} from "@radix-ui/react-scroll-area";

import {useComponentProps} from "../../providers";

import styles from "./scroll-area.module.scss";

export interface ScrollAreaProps extends ScrollAreaRootProps {
    xOffset?: number;
    yOffset?: number;
    horizontalScroll?: boolean;
    thumbClassName?: string;
    cornerClassName?: string;
    viewportClassName?: string;
    scrollbarClassName?: string;
}

const ScrollArea: ForwardRefRenderFunction<HTMLDivElement, ScrollAreaProps> = (props, ref) => {
    const {
        xOffset,
        yOffset,
        children,
        className,
        horizontalScroll,
        onScroll,
        thumbClassName,
        cornerClassName,
        viewportClassName,
        scrollbarClassName,
        ...other
    } = {...useComponentProps("scrollArea"), ...props};
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const viewportRef = React.useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => viewportRef.current!, []);

    return (
        <Root ref={rootRef} className={classnames(styles["scroll-area"], className)} {...other}>
            <Viewport
                ref={viewportRef}
                className={classnames(
                    styles["scroll-area__viewport"],
                    {
                        [styles["scroll-area__viewport--horizontal"]]: !horizontalScroll,
                    },
                    viewportClassName
                )}
                onScroll={onScroll}
            >
                {children}
            </Viewport>

            <Scrollbar
                orientation="vertical"
                style={{padding: `0 ${xOffset}px`}}
                className={classnames(styles["scroll-area__scrollbar"], scrollbarClassName)}
            >
                <Thumb className={classnames(styles["scroll-area__thumb"], thumbClassName)} />
            </Scrollbar>

            <Scrollbar
                orientation="horizontal"
                style={{padding: `${yOffset}px 0`}}
                className={classnames(styles["scroll-area__scrollbar"], scrollbarClassName)}
            >
                <Thumb className={classnames(styles["scroll-area__thumb"], thumbClassName)} />
            </Scrollbar>

            <Corner className={classnames(styles["scroll-area__corner"], cornerClassName)} />
        </Root>
    );
};

export default memo(forwardRef(ScrollArea));
