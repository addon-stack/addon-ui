import React, {type ComponentProps, forwardRef, type ForwardRefRenderFunction, memo, type ReactNode} from "react";

import classnames from "classnames";

import {cloneOrCreateElement} from "../../utils";

import styles from "./base-button.module.scss?isolation";

export interface BaseButtonProps extends ComponentProps<"button"> {
    after?: ReactNode;
    before?: ReactNode;
    afterClassName?: string;
    beforeClassName?: string;
    childrenClassName?: string;
}

const BaseButton: ForwardRefRenderFunction<HTMLButtonElement, BaseButtonProps> = (props, ref) => {
    const {after, before, children, className, afterClassName, beforeClassName, childrenClassName, ...other} = props;

    return (
        <button ref={ref} className={classnames(styles["base-button"], className)} {...other}>
            {cloneOrCreateElement(before, {
                className: classnames(styles["base-button__before"], beforeClassName),
            })}

            {cloneOrCreateElement(children, {
                className: classnames(styles["base-button__children"], childrenClassName),
            })}

            {cloneOrCreateElement(after, {
                className: classnames(styles["base-button__after"], afterClassName),
            })}
        </button>
    );
};

export default memo(forwardRef(BaseButton));
