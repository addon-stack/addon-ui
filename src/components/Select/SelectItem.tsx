import React, {forwardRef, type ForwardRefRenderFunction, memo, useContext} from "react";

import {Item, type SelectItemProps as SelectItemRadixProps} from "@radix-ui/react-select";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import {focusElement, getActiveElement} from "../../utils/dom/focus";
import {getShadowRoot} from "../../utils/dom/shadow";

import {SelectTypeaheadContext} from "./context";
import SelectItemIndicator from "./SelectItemIndicator";
import SelectItemText from "./SelectItemText";

import styles from "./select.module.scss";

export interface SelectItemProps extends SelectItemRadixProps {
    indicator?: React.ReactNode;
    indicatorClassname?: string;
}

const SelectItem: ForwardRefRenderFunction<HTMLDivElement, SelectItemProps> = (props, ref) => {
    const typeaheadSpace = useContext(SelectTypeaheadContext);

    const {textValue, indicator, indicatorClassname, className, children, onPointerLeave, onKeyDown, ...other} = {
        ...useComponentProps("selectItem"),
        ...props,
    };

    return (
        <Item
            ref={ref}
            textValue={textValue}
            className={classnames(styles["select__item"], className)}
            {...other}
            data-addon-ui-text={textValue}
            onKeyDown={event => {
                onKeyDown?.(event);
                typeaheadSpace?.(event);
            }}
            onPointerLeave={event => {
                onPointerLeave?.(event);

                if (
                    !event.defaultPrevented &&
                    getShadowRoot(event.currentTarget) &&
                    getActiveElement(event.currentTarget) === event.currentTarget
                ) {
                    focusElement(event.currentTarget.closest('[role="listbox"]'));
                }
            }}
        >
            {children && children}

            {!children && (
                <>
                    {indicator && <SelectItemIndicator className={indicatorClassname}>{indicator}</SelectItemIndicator>}

                    {textValue && <SelectItemText>{textValue}</SelectItemText>}
                </>
            )}
        </Item>
    );
};

export default memo(forwardRef(SelectItem));
