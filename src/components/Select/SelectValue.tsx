import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {SelectValueProps, Value} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import styles from "./select.module.scss";

export {type SelectValueProps};

const SelectValue: ForwardRefRenderFunction<HTMLSpanElement, SelectValueProps> = (props, ref) => {
    const {className, ...other} = {...useComponentProps("selectValue"), ...props};

    return <Value ref={ref} className={classnames(styles["select__value"], className)} {...other} />;
};

export default memo(forwardRef(SelectValue));
