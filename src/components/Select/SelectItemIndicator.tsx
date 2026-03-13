import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {ItemIndicator, SelectItemIndicatorProps} from "@radix-ui/react-select";

import styles from "./select.module.scss";

export {type SelectItemIndicatorProps};

const SelectItemIndicator: ForwardRefRenderFunction<HTMLSpanElement, SelectItemIndicatorProps> = (props, ref) => {
    const {className, ...other} = props;

    return <ItemIndicator ref={ref} className={classnames(styles["select__item__indicator"], className)} {...other} />;
};

export default memo(forwardRef(SelectItemIndicator));
