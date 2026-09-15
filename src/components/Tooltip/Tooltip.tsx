import React, {forwardRef, type ForwardRefRenderFunction, memo, type ReactNode} from "react";

import {
    Arrow,
    Content,
    Portal,
    Provider,
    Root,
    type TooltipContentProps,
    type TooltipPortalProps,
    type TooltipProps as TooltipRootProps,
    Trigger,
} from "@radix-ui/react-tooltip";

import classnames from "classnames";

import {useFloatingLayer} from "../../hooks/floating";
import {useComponentProps, usePortalContainer} from "../../providers";

import styles from "./tooltip.module.scss?isolation";

export interface TooltipProps
    extends TooltipRootProps, Omit<TooltipContentProps, "content">, Pick<TooltipPortalProps, "container"> {
    content: ReactNode;
    arrowWidth?: number;
    arrowHeight?: number;
    matchTriggerWidth?: boolean;
    arrowClassName?: string;
    contentClassName?: string;
}

const Tooltip: ForwardRefRenderFunction<HTMLDivElement, TooltipProps> = (props, ref) => {
    const layer = useFloatingLayer({ref});
    const config = useComponentProps("tooltip");
    const container = usePortalContainer(props.container, config?.container);

    const {
        open,
        defaultOpen,
        disableHoverableContent,
        delayDuration = 250,
        onOpenChange,

        arrowWidth,
        arrowHeight,
        collisionPadding = 8,
        matchTriggerWidth,
        content,
        className,
        arrowClassName,
        contentClassName,
        children,
        container: _container,
        ...other
    } = {...config, ...props};

    return (
        <Provider>
            <Root
                open={open}
                defaultOpen={defaultOpen}
                disableHoverableContent={disableHoverableContent}
                onOpenChange={onOpenChange}
                delayDuration={delayDuration}
            >
                <Trigger asChild>{children}</Trigger>
                {container !== null && (
                    <Portal container={container}>
                        <Content
                            ref={layer.ref}
                            className={classnames(
                                styles["tooltip-content"],
                                {
                                    [styles["tooltip-content--trigger-width"]]: matchTriggerWidth,
                                },
                                className,
                                contentClassName
                            )}
                            collisionPadding={collisionPadding}
                            {...other}
                            style={{zIndex: layer.zIndex, ...other.style}}
                        >
                            {content}
                            <Arrow
                                width={arrowWidth}
                                height={arrowHeight}
                                className={classnames(styles["tooltip-arrow"], arrowClassName)}
                            />
                        </Content>
                    </Portal>
                )}
            </Root>
        </Provider>
    );
};

export default memo(forwardRef(Tooltip));
