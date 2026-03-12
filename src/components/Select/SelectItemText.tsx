import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {ItemText, SelectItemTextProps} from "@radix-ui/react-select";

import styles from "./select.module.scss";

export {type SelectItemTextProps};

const SelectItemText: ForwardRefRenderFunction<HTMLSpanElement, SelectItemTextProps> = (props, ref) => {
    const {className, ...other} = props;

    return <ItemText ref={ref} className={classnames(styles["select__item__text"], className)} {...other} />;
};

export default memo(forwardRef(SelectItemText));
