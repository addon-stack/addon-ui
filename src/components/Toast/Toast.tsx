import React, {
    forwardRef,
    type ForwardRefRenderFunction,
    memo,
    type ReactElement,
    type ReactNode,
    useState,
} from "react";

import {
    Description,
    Provider,
    Root,
    Title,
    type ToastProps as ToastRootProps,
    type ToastProviderProps,
    Viewport,
} from "@radix-ui/react-toast";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {cloneOrCreateElement} from "../../utils";
import {IconButton, type IconButtonProps} from "../IconButton";

import {useShadowViewport} from "./hooks/use-shadow-viewport";
import {ToastFocusRestore} from "./ToastFocusRestore";
import {ToastAnimation, type ToastColor, type ToastRadius, ToastSide} from "./types";

import styles from "./toast.module.scss";

const toastSideBySwipeDirectionMap = {
    [ToastSide.TopLeft]: "left",
    [ToastSide.TopCenter]: "up",
    [ToastSide.TopRight]: "right",
    [ToastSide.BottomRight]: "right",
    [ToastSide.BottomCenter]: "down",
    [ToastSide.BottomLeft]: "left",
} as Record<ToastSide, ToastProviderProps["swipeDirection"]>;

export interface ToastProps extends Omit<ToastRootProps, "title">, Omit<ToastProviderProps, "children"> {
    side?: ToastSide;
    color?: ToastColor;
    radius?: ToastRadius;
    title?: ReactNode;
    action?: ReactNode;
    animationIn?: ToastAnimation;
    animationOut?: ToastAnimation;
    description?: ReactNode;
    closeIcon?: ReactElement;
    closeProps?: IconButtonProps;
    titleClassName?: string;
    actionClassName?: string;
    viewportClassName?: string;
    descriptionClassName?: string;
    onClose?: () => void;
    fullWidth?: boolean;
    sticky?: boolean;
}

const Toast: ForwardRefRenderFunction<HTMLLIElement, ToastProps> = (props, ref) => {
    const viewport = useShadowViewport();
    const defaultProps = useComponentProps("toast");
    const mergedProps = {...defaultProps, ...props};

    const {
        side = ToastSide.BottomRight,
        color,
        radius,
        title,
        action,
        animationIn = ToastAnimation.Slide,
        animationOut = ToastAnimation.Slide,
        description,
        fullWidth,
        sticky,
        closeIcon = "✖",
        closeProps,

        label,
        duration,
        swipeDirection = toastSideBySwipeDirectionMap[side],
        swipeThreshold = ["up", "down"].includes(swipeDirection || "") ? 15 : 50,

        className,
        titleClassName,
        actionClassName,
        viewportClassName,
        descriptionClassName,
        children,
        onClose,
        onKeyDown,
        onKeyDownCapture,
        open,
        defaultOpen,
        onOpenChange,
        forceMount,
        ...other
    } = mergedProps;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? true);
    const isOpen = open ?? uncontrolledOpen;
    const {className: closeClassName, ...otherCloseProps} = closeProps || {};

    return (
        <Provider label={label} duration={duration} swipeDirection={swipeDirection} swipeThreshold={swipeThreshold}>
            {children}
            <Root
                ref={ref}
                open={isOpen}
                forceMount={forceMount}
                onOpenChange={value => {
                    setUncontrolledOpen(value);
                    onOpenChange?.(value);
                }}
                className={classnames(
                    styles["toast"],
                    {
                        [styles[`toast--${side}`]]: side,
                        [styles[`toast--${color}-color`]]: color,
                        [styles[`toast--${radius}-radius`]]: radius,
                        [styles[`toast--${animationIn}-animation-in`]]: animationIn,
                        [styles[`toast--${animationOut}-animation-out`]]: animationOut,
                        [styles["toast--sticky"]]: sticky,
                        [styles["toast--full-width"]]: fullWidth,
                    },
                    className
                )}
                {...other}
                onKeyDown={onKeyDown}
                onKeyDownCapture={event => {
                    onKeyDownCapture?.(event);

                    if (viewport.handlesKey(event)) {
                        onKeyDown?.(event);
                        viewport.onKeyDown(event);
                    }
                }}
            >
                {(!forceMount || isOpen) && <ToastFocusRestore viewport={viewport.node} />}
                {title && <Title className={classnames(styles["toast__title"], titleClassName)}>{title}</Title>}

                {description && (
                    <Description className={classnames(styles["toast__description"], descriptionClassName)}>
                        {description}
                    </Description>
                )}

                {cloneOrCreateElement(action, {className: classnames(styles["toast__action"], actionClassName)})}

                {onClose && (
                    <IconButton
                        aria-label="Close"
                        onClick={onClose}
                        className={classnames(styles["toast__close"], closeClassName)}
                        {...otherCloseProps}
                    >
                        {closeIcon}
                    </IconButton>
                )}
            </Root>

            <Viewport
                ref={viewport.ref}
                onKeyDownCapture={viewport.onKeyDownCapture}
                className={classnames(styles["toast__viewport"], viewportClassName)}
            />
        </Provider>
    );
};

export default memo(forwardRef(Toast));
