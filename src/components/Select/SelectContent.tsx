import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {
    Arrow,
    Content,
    Portal,
    SelectContentProps as SelectContentRadixProps,
    SelectPortalProps,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectViewportProps,
    Viewport,
} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import styles from "./select.module.scss";

export interface SelectContentProps extends SelectContentRadixProps, SelectPortalProps {
    arrow?: boolean;
    arrowWidth?: number;
    arrowHeight?: number;
    fullWidth?: boolean;
    viewportProps?: SelectViewportProps;
    scrollUpButton?: React.ReactNode;
    scrollDownButton?: React.ReactNode;
}

const SelectContent: ForwardRefRenderFunction<HTMLDivElement, SelectContentProps> = (props, ref) => {
    const {
        arrow,
        arrowWidth,
        arrowHeight,
        fullWidth = true,
        position = "popper",
        container,
        viewportProps,
        scrollUpButton,
        scrollDownButton,
        className,
        children,
        ...other
    } = {...useComponentProps("selectContent"), ...props};

    return (
        <Portal container={container}>
            <Content
                ref={ref}
                className={classnames(
                    styles["select__content"],
                    {
                        [styles["select__content--full-width"]]: fullWidth,
                    },
                    className
                )}
                position={position}
                {...other}
            >
                {scrollUpButton && (
                    <SelectScrollUpButton className={classnames(styles["select__scroll-button"])}>
                        {scrollUpButton}
                    </SelectScrollUpButton>
                )}

                <Viewport
                    {...viewportProps}
                    className={classnames(styles["select__viewport"], viewportProps?.className)}
                >
                    {children}
                </Viewport>

                {scrollDownButton && (
                    <SelectScrollDownButton className={classnames(styles["select__scroll-button"])}>
                        {scrollDownButton}
                    </SelectScrollDownButton>
                )}

                {arrow && <Arrow className={styles["select__arrow"]} width={arrowWidth} height={arrowHeight} />}
            </Content>
        </Portal>
    );
};

export default memo(forwardRef(SelectContent));
