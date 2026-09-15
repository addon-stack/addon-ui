import {cloneElement, createElement, isValidElement, type JSX, type ReactNode} from "react";

import classnames from "classnames";

export const cloneOrCreateElement = <T extends keyof JSX.IntrinsicElements>(
    element: ReactNode,
    props: JSX.IntrinsicElements[T] = {},
    wrapperTag: T = "span" as T
) => {
    if (isValidElement<{className?: string}>(element)) {
        return cloneElement(element, {
            ...props,
            className: classnames(element.props.className, props.className),
        });
    }

    if (element) {
        return createElement(wrapperTag, {...props}, element);
    }

    return null;
};
