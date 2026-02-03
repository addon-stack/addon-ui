import React, {
    ComponentProps,
    forwardRef,
    ForwardRefRenderFunction,
    memo,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import classnames from "classnames";

import {useComponentProps} from "../../providers";

import {calculateMiddleTruncate} from "./utils";

import styles from "./truncate.module.scss";

export interface TruncateProps extends ComponentProps<"span"> {
    text?: string;
    middle?: boolean;
    separator?: string;
    contentClassname?: string;
    render?: (text: string) => React.ReactNode;
}

const Truncate: ForwardRefRenderFunction<HTMLSpanElement, TruncateProps> = (props, ref) => {
    const {
        text = "",
        middle,
        separator = "...",
        className,
        contentClassname,
        render,
        ...other
    } = {...useComponentProps("truncate"), ...props};

    const containerRef = useRef<HTMLSpanElement>(null);
    const [displayedText, setDisplayedText] = useState(text);

    useImperativeHandle(ref, () => containerRef.current!, []);

    useLayoutEffect(() => {
        const el = containerRef.current;

        if (!middle || !el) {
            setDisplayedText(text);
            return;
        }

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (!entry) return;

            const maxWidth = entry.contentRect.width;
            const {fontWeight, fontSize, fontFamily, letterSpacing} = window.getComputedStyle(el);

            const font = [fontWeight, fontSize, fontFamily].join(" ");

            const truncated = calculateMiddleTruncate(text, maxWidth, font, letterSpacing, separator);

            setDisplayedText(prev => (prev !== truncated ? truncated : prev));
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [text, middle, separator]);

    const content = render ? render(displayedText) : displayedText;

    return (
        <span
            ref={containerRef}
            className={classnames(
                styles["truncate"],
                {
                    [styles["truncate--middle"]]: middle,
                },
                className
            )}
            title={text}
            {...other}
        >
            {middle ? (
                <>
                    <span className={styles["truncate__hidden"]} aria-hidden="true">
                        {text}
                    </span>
                    <span className={classnames(styles["truncate__content"], contentClassname)}>{content}</span>
                </>
            ) : (
                content
            )}
        </span>
    );
};

Truncate.displayName = "Truncate";

export default memo(forwardRef(Truncate));
