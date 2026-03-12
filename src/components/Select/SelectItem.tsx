import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {Item, SelectItemProps as SelectItemRadixProps} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import SelectItemIndicator from "./SelectItemIndicator";
import SelectItemText from "./SelectItemText";

import styles from "./select.module.scss";

export interface SelectItemProps extends SelectItemRadixProps {
    indicator?: React.ReactNode;
    indicatorClassname?: string;
}

const SelectItem: ForwardRefRenderFunction<HTMLDivElement, SelectItemProps> = (props, ref) => {
    const {textValue, indicator, indicatorClassname, className, children, ...other} = {
        ...useComponentProps("selectItem"),
        ...props,
    };

    return (
        <Item ref={ref} textValue={textValue} className={classnames(styles["select__item"], className)} {...other}>
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
