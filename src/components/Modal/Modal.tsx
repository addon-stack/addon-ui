import React, {
    forwardRef,
    type ForwardRefRenderFunction,
    isValidElement,
    memo,
    type ReactElement,
    useCallback,
} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {cloneOrCreateElement} from "../../utils";
import {Dialog, type DialogProps, DialogPropsKeys} from "../Dialog";
import {IconButton, type IconButtonProps} from "../IconButton";

import {ModalAnimation, type ModalRadius} from "./types";

import styles from "./modal.module.scss?isolation";

export interface ModalProps extends DialogProps {
    radius?: ModalRadius;
    closeButton?: boolean | IconButtonProps | ReactElement;
    onClose?: () => void;
    animation?: ModalAnimation;
}

export const ModalPropsKeys = new Set<keyof ModalProps>(["radius", "closeButton", "onClose", ...DialogPropsKeys]);

const Modal: ForwardRefRenderFunction<HTMLDivElement, ModalProps> = (props, ref) => {
    const config = useComponentProps("modal");

    const {
        radius,
        fullscreen = true,
        closeButton = true,
        onClose,
        onOpenChange,
        children,
        className,
        overlayClassName,
        childrenClassName,
        animation = ModalAnimation.FadeScale,
        container = config?.container,
        ...other
    } = {...config, ...props};

    const handleClose = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            onClose?.();
            onOpenChange?.(false);

            if (typeof closeButton === "object" && !isValidElement(closeButton)) {
                closeButton?.onClick?.(event);
            }
        },
        [onClose, onOpenChange, closeButton]
    );

    const renderCloseButton = useCallback(() => {
        if (!closeButton) {
            return null;
        }

        if (isValidElement(closeButton)) {
            return closeButton;
        }

        const closeButtonProps = typeof closeButton === "object" ? closeButton : {};

        return (
            <IconButton
                aria-label="Close"
                children="✖"
                {...closeButtonProps}
                onClick={handleClose}
                className={classnames(styles["modal-close"], closeButtonProps.className)}
            />
        );
    }, [closeButton, handleClose]);

    return (
        <Dialog
            ref={ref}
            {...other}
            container={container}
            onOpenChange={onOpenChange}
            overlayClassName={classnames(styles["modal-overlay"], overlayClassName)}
            className={classnames(
                styles["modal-content"],
                {
                    [styles["modal-content--fullscreen"]]: fullscreen,
                    [styles[`modal-content--${radius}-radius`]]: radius,
                    [styles[`modal-content--${animation}-animation`]]: animation,
                },
                className
            )}
        >
            {cloneOrCreateElement(
                children,
                {className: classnames(styles["modal-children"], childrenClassName)},
                "div"
            )}
            {renderCloseButton()}
        </Dialog>
    );
};

export default memo(forwardRef(Modal));
