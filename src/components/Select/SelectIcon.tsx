import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {SelectIconProps, Icon} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import styles from "./select.module.scss";

export {type SelectIconProps};

const SelectIcon: ForwardRefRenderFunction<HTMLSpanElement, SelectIconProps> = (props, ref) => {
    const {className, ...other} = {...useComponentProps("selectIcon"), ...props};

    return <Icon ref={ref} className={classnames(styles["select__icon"], className)} {...other} />;
};

export default memo(forwardRef(SelectIcon));
