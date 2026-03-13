import React, {
    Children,
    cloneElement,
    ComponentProps,
    createElement,
    CSSProperties,
    forwardRef,
    ForwardRefRenderFunction,
    isValidElement,
    memo,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import classnames from "classnames";

import styles from "./shift.module.scss";

export interface ShiftProps extends ComponentProps<"div"> {
    active?: number;
    height?: number;
    adaptiveHeight?: boolean;
    itemClassName?: string;
}

const Shift: ForwardRefRenderFunction<HTMLDivElement, ShiftProps> = (props, ref) => {
    const {
        active = 1,
        height,
        adaptiveHeight = true,
        itemClassName,
        className,
        style,
        children: childrenProps,
        ...other
    } = props;

    const [currentHeight, setCurrentHeight] = useState<number>();

    const containerRef = useRef<HTMLDivElement>(null);

    const children = Children.map(childrenProps, (child, index) => {
        const item = index + 1;

        const className = classnames(styles["shift-item"], itemClassName);

        const style: CSSProperties = {
            opacity: 0,
        };

        if (item > active) {
            style.transform = `translate3d(0, ${(item - active) * 100}%, 0)`;
        } else if (item < active) {
            style.transform = `translate3d(0, -${(active - item) * 100}%, 0)`;
        } else {
            style.opacity = 1;
            style.transform = "translate3d(0, 0, 0)";
        }

        if (!isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
            return createElement("span", {className, style}, child);
        }

        return cloneElement(child, {
            style: {...(child.props?.style ?? {}), ...style},
            className: classnames(className, child.props.className),
        });
    });

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useLayoutEffect(() => {
        const el = containerRef.current?.children[active - 1] as HTMLElement;

        if (el) {
            setCurrentHeight(el.offsetHeight);
        }
    }, [active]);

    return (
        <div
            ref={containerRef}
            className={classnames(styles["shift"], className)}
            style={{
                ...style,
                ...(adaptiveHeight ? {height: currentHeight} : {}),
                ...(height ? {height} : {}),
            }}
            {...other}
        >
            {children}
        </div>
    );
};

export default memo(forwardRef(Shift));
