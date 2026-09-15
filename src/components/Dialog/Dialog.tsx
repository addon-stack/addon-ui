import React, {forwardRef, type ForwardRefRenderFunction, memo, useState} from "react";

import {
    Content,
    Description,
    type DialogContentProps,
    type DialogPortalProps,
    type DialogProps as DialogRootProps,
    Overlay,
    Portal,
    Root,
    Title,
} from "@radix-ui/react-dialog";
import {VisuallyHidden} from "radix-ui";

import classnames from "classnames";

import {FloatingLayerContext, useFloatingFocus, useFloatingLayer} from "../../hooks/floating";
import {useComponentProps, usePortalContainer} from "../../providers";
import {cloneOrCreateElement} from "../../utils";
import {getShadowRoot} from "../../utils/dom/shadow";

import styles from "./dialog.module.scss?isolation";

export interface DialogProps extends DialogRootProps, DialogPortalProps, DialogContentProps {
    speed?: number;
    description?: string;
    fullscreen?: boolean;
    className?: string;
    overlayClassName?: string;
    childrenClassName?: string;
}

export const DialogPropsKeys = new Set<keyof DialogProps>([
    // Dialog keys
    "speed",
    "description",
    "fullscreen",
    "className",
    "overlayClassName",
    "childrenClassName",

    // Extended Dialog keys
    "open",
    "defaultOpen",
    "onOpenChange",
    "modal",
    "container",
    "title",
]);

const Dialog: ForwardRefRenderFunction<HTMLDivElement, DialogProps> = (props, ref) => {
    const config = useComponentProps("dialog");
    const container = usePortalContainer(props.container, config?.container);

    const {
        speed = 200,
        open,
        defaultOpen,
        onOpenChange,
        modal,
        children,
        title,
        description,
        className,
        overlayClassName,
        childrenClassName,
        onOpenAutoFocus,
        onCloseAutoFocus,
        onKeyDown,
        onWheel,
        onTouchMove,
        container: _container,
        ...other
    } = {...config, ...props};

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const isOpen = open ?? uncontrolledOpen;
    const layer = useFloatingLayer({ref, active: isOpen, modal: modal !== false});
    const focus = useFloatingFocus(layer);

    return (
        <Root
            open={isOpen}
            onOpenChange={value => {
                setUncontrolledOpen(value);
                onOpenChange?.(value);
            }}
            modal={modal}
        >
            {container !== null && (
                <Portal container={container}>
                    <Overlay
                        className={classnames(styles["dialog-overlay"], overlayClassName)}
                        style={{
                            animationDuration: `${speed}ms`,
                            zIndex: layer.zIndex === undefined ? undefined : layer.zIndex - 1,
                        }}
                    />
                    <Content
                        ref={focus.ref}
                        className={classnames(styles["dialog-content"], className)}
                        {...other}
                        style={{animationDuration: `${speed}ms`, zIndex: layer.zIndex, ...other.style}}
                        onOpenAutoFocus={event => {
                            onOpenAutoFocus?.(event);
                            focus.onOpenAutoFocus(event);
                        }}
                        onCloseAutoFocus={event => {
                            onCloseAutoFocus?.(event);
                            focus.onCloseAutoFocus(event);
                        }}
                        onKeyDown={event => {
                            onKeyDown?.(event);
                            focus.onKeyDown(event);
                        }}
                        onWheel={event => {
                            onWheel?.(event);

                            if (getShadowRoot(event.currentTarget)) {
                                event.stopPropagation();
                            }
                        }}
                        onTouchMove={event => {
                            onTouchMove?.(event);

                            if (getShadowRoot(event.currentTarget)) {
                                event.stopPropagation();
                            }
                        }}
                    >
                        <VisuallyHidden.Root>
                            <Title>{title}</Title>
                            <Description>{description}</Description>
                        </VisuallyHidden.Root>

                        <FloatingLayerContext.Provider value={layer.layer}>
                            {cloneOrCreateElement(
                                children,
                                {className: classnames(styles["dialog-children"], childrenClassName)},
                                "div"
                            )}
                        </FloatingLayerContext.Provider>
                    </Content>
                </Portal>
            )}
        </Root>
    );
};

export default memo(forwardRef(Dialog));
