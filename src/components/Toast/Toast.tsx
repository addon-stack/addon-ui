import React, {memo, ReactElement, ReactNode, forwardRef, ForwardRefRenderFunction} from "react";
import classnames from "classnames";
import {
    Description,
    Provider,
    Root,
    Title,
    ToastProps as ToastRootProps,
    ToastProviderProps,
    Viewport,
} from "@radix-ui/react-toast";

import {IconButton, IconButtonProps} from "../IconButton";
import {cloneOrCreateElement} from "../../utils";
import {useComponentProps} from "../../providers";

import {ToastSide, ToastRadius, ToastColor, ToastAnimation} from "./types";

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
        ...other
    } = mergedProps;

    const {className: closeClassName, ...otherCloseProps} = closeProps || {};
    return (
        <Provider label={label} duration={duration} swipeDirection={swipeDirection} swipeThreshold={swipeThreshold}>
            {children}
            <Root
                ref={ref}
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
            >
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

            <Viewport className={classnames(styles["toast__viewport"], viewportClassName)} />
        </Provider>
    );
};

export default memo(forwardRef(Toast));
