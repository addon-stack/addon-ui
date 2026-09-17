import React, {forwardRef, type ForwardRefRenderFunction, memo, useContext, useLayoutEffect} from "react";

import {
    Arrow,
    Content,
    Portal,
    type SelectContentProps as SelectContentRadixProps,
    type SelectPortalProps,
    SelectScrollDownButton,
    SelectScrollUpButton,
    type SelectViewportProps,
    Viewport,
} from "@radix-ui/react-select";

import classnames from "classnames";

import {FloatingLayerContext, useFloatingLayer} from "../../hooks/floating";
import {useComponentProps, usePortalContainer} from "../../providers";

import {SelectPortalContext, SelectTypeaheadContext} from "./context";
import {useSelectNavigation} from "./hooks/use-select-navigation";

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
    const config = useComponentProps("selectContent");
    const container = usePortalContainer(props.container, config?.container);
    const {open, setReady} = useContext(SelectPortalContext);
    const layer = useFloatingLayer({ref, active: open});
    const navigation = useSelectNavigation(open);

    useLayoutEffect(() => {
        setReady(container !== null);
    }, [container, setReady]);

    const {
        arrow,
        arrowWidth,
        arrowHeight,
        fullWidth = true,
        position = "popper",
        viewportProps,
        scrollUpButton,
        scrollDownButton,
        className,
        children,
        onKeyDown,
        onFocus,
        container: _container,
        ...other
    } = {...config, ...props};

    const content = (
        <Content
            ref={layer.ref}
            className={classnames(
                styles["select__content"],
                {
                    [styles["select__content--full-width"]]: fullWidth,
                },
                className
            )}
            position={position}
            {...other}
            style={{zIndex: layer.zIndex, ...other.style}}
            onFocus={event => {
                onFocus?.(event);
                navigation.onFocus(event);
            }}
            onKeyDown={event => {
                onKeyDown?.(event);
                navigation.onKeyDown(event);
            }}
        >
            {scrollUpButton && (
                <SelectScrollUpButton className={classnames(styles["select__scroll-button"])}>
                    {scrollUpButton}
                </SelectScrollUpButton>
            )}

            <Viewport {...viewportProps} className={classnames(styles["select__viewport"], viewportProps?.className)}>
                <FloatingLayerContext.Provider value={layer.layer}>
                    <SelectTypeaheadContext.Provider value={navigation.onTypeaheadSpace}>
                        {children}
                    </SelectTypeaheadContext.Provider>
                </FloatingLayerContext.Provider>
            </Viewport>

            {scrollDownButton && (
                <SelectScrollDownButton className={classnames(styles["select__scroll-button"])}>
                    {scrollDownButton}
                </SelectScrollDownButton>
            )}

            {arrow && <Arrow className={styles["select__arrow"]} width={arrowWidth} height={arrowHeight} />}
        </Content>
    );

    // Closed Content registers items in Radix's detached fragment. Never mount open Content inline.
    if (container === null) {
        return open ? null : content;
    }

    return <Portal container={container}>{content}</Portal>;
};

export default memo(forwardRef(SelectContent));
