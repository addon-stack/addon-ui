import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {ItemText, type SelectItemTextProps} from "@radix-ui/react-select";

import classnames from "classnames";

import styles from "./select.module.scss";

export {type SelectItemTextProps};

const SelectItemText: ForwardRefRenderFunction<HTMLSpanElement, SelectItemTextProps> = (props, ref) => {
    const {className, ...other} = props;

    return <ItemText ref={ref} className={classnames(styles["select__item__text"], className)} {...other} />;
};

export default memo(forwardRef(SelectItemText));
