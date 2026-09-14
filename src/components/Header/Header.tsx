import React, {ComponentProps, memo, ReactNode, forwardRef, ForwardRefRenderFunction} from "react";
import classnames from "classnames";

import {cloneOrCreateElement} from "../../utils";
import {useComponentProps} from "../../providers";

import styles from "./header.module.scss?isolation";

export interface HeaderProps extends Omit<ComponentProps<"header">, "title"> {
    title?: ReactNode;
    before?: ReactNode;
    after?: ReactNode;
    subtitle?: ReactNode;
    wrapClassName?: string;
    titleClassName?: string;
    beforeClassName?: string;
    afterClassName?: string;
    subtitleClassName?: string;
    childrenClassName?: string;
    alignCenter?: boolean;
}

const Header: ForwardRefRenderFunction<HTMLElement, HeaderProps> = (props, ref) => {
    const {
        title,
        before,
        after,
        subtitle,
        className,
        wrapClassName,
        titleClassName,
        beforeClassName,
        afterClassName,
        subtitleClassName,
        childrenClassName,
        alignCenter = true,
        children,
        ...other
    } = {...useComponentProps("header"), ...props};

    return (
        <header
            ref={ref}
            {...other}
            className={classnames(
                styles["header"],
                {
                    [styles["header--center"]]: alignCenter,
                },
                className
            )}
        >
            {(title || subtitle) && (
                <div className={classnames(styles["header__wrap"], wrapClassName)}>
                    <h1 className={classnames(styles["header__title"], titleClassName)}>
                        {cloneOrCreateElement(before, {className: beforeClassName})}
                        {title}
                        {cloneOrCreateElement(after, {className: afterClassName})}
                    </h1>

                    {cloneOrCreateElement(
                        subtitle,
                        {className: classnames(styles["header__subtitle"], subtitleClassName)},
                        "h2"
                    )}
                </div>
            )}

            {cloneOrCreateElement(children, {className: childrenClassName}, "div")}
        </header>
    );
};

export default memo(forwardRef(Header));
