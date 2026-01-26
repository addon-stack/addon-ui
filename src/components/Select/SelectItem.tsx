import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {Item, ItemIndicator, ItemText, SelectItemProps as SelectItemRadixProps} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import styles from "./select.module.scss";

export interface SelectItemProps extends SelectItemRadixProps {
    indicator?: React.ReactNode;
    indicatorClassname?: string;
}

const SelectItem: ForwardRefRenderFunction<HTMLDivElement, SelectItemProps> = (props, ref) => {
    const {indicator, textValue, className, indicatorClassname, children, ...other} = {
        ...useComponentProps("selectItem"),
        ...props,
    };

    return (
        <Item ref={ref} className={classnames(styles["select__item"], className)} textValue={textValue} {...other}>
            {children && children}

            {!children && (
                <>
                    {indicator && (
                        <ItemIndicator className={classnames(styles["select__item__indicator"], indicatorClassname)}>
                            {indicator}
                        </ItemIndicator>
                    )}

                    {textValue && <ItemText className={classnames(styles["select__item__text"])}>{textValue}</ItemText>}
                </>
            )}
        </Item>
    );
};

export default memo(forwardRef(SelectItem));
