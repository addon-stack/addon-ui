import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {ItemIndicator, type SelectItemIndicatorProps} from "@radix-ui/react-select";

import classnames from "classnames";

import styles from "./select.module.scss";

export {type SelectItemIndicatorProps};

const SelectItemIndicator: ForwardRefRenderFunction<HTMLSpanElement, SelectItemIndicatorProps> = (props, ref) => {
    const {className, ...other} = props;

    return <ItemIndicator ref={ref} className={classnames(styles["select__item__indicator"], className)} {...other} />;
};

export default memo(forwardRef(SelectItemIndicator));
