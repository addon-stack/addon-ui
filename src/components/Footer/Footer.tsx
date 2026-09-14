import React, {ComponentProps, memo, ReactNode, forwardRef, ForwardRefRenderFunction} from "react";
import classnames from "classnames";

import {cloneOrCreateElement} from "../../utils";
import {useComponentProps} from "../../providers";

import styles from "./footer.module.scss?isolation";

export interface FooterProps extends ComponentProps<"footer"> {
    left?: ReactNode;
    right?: ReactNode;
    shadow?: boolean;
    reverse?: boolean;
    leftClassName?: string;
    rightClassName?: string;
    childrenClassName?: string;
}

const Footer: ForwardRefRenderFunction<HTMLElement, FooterProps> = (props, ref) => {
    const {
        left,
        right,
        shadow,
        reverse,
        children,
        className,
        leftClassName,
        rightClassName,
        childrenClassName,
        ...other
    } = {...useComponentProps("footer"), ...props};

    return (
        <footer
            ref={ref}
            {...other}
            className={classnames(
                styles["footer"],
                {
                    [styles["footer--shadow"]]: shadow,
                    [styles["footer--reverse"]]: reverse,
                },
                className
            )}
        >
            {cloneOrCreateElement(
                children,
                {className: classnames(styles["footer-children"], childrenClassName)},
                "div"
            )}
            {!children &&
                cloneOrCreateElement(left, {className: classnames(styles["footer-left"], leftClassName)}, "div")}
            {!children &&
                cloneOrCreateElement(right, {className: classnames(styles["footer-right"], rightClassName)}, "div")}
        </footer>
    );
};

export default memo(forwardRef(Footer));
