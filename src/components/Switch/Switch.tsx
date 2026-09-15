import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {Root, type SwitchProps as SwitchRootProps, Thumb} from "@radix-ui/react-switch";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import styles from "./switch.module.scss?isolation";

export interface SwitchProps extends SwitchRootProps {
    thumbClassName?: string;
}

const Switch: ForwardRefRenderFunction<HTMLButtonElement, SwitchProps> = (props, ref) => {
    const {className, thumbClassName, children, ...other} = {...useComponentProps("switch"), ...props};

    return (
        <Root ref={ref} {...other} className={classnames(styles["switch"], className)}>
            <Thumb className={classnames(styles["switch__thumb"], thumbClassName)} />
            {children}
        </Root>
    );
};

export default memo(forwardRef(Switch));
