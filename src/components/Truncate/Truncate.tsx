import React, {
    ComponentProps,
    forwardRef,
    ForwardRefRenderFunction,
    memo,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import debounce from "debounce";
import classnames from "classnames";

import {useComponentProps} from "../../providers";

import {Highlight, HighlightProps} from "../Highlight";

import styles from "./truncate.module.scss";

export interface TruncateProps extends ComponentProps<"span"> {
    text?: string;
    middle?: boolean;
    separator?: string;
    highlight?: Omit<HighlightProps, "textToHighlight">;
}

const trimMiddle = (el: HTMLElement, text: string, separator: string) => {
    const measure = (txt: string) => {
        el.textContent = txt;
        return el.scrollWidth <= el.clientWidth;
    };

    if (measure(text)) return text;

    let low = 0;
    let high = text.length - 2;
    let result = "";

    while (low <= high) {
        const size = Math.floor((low + high) / 2);
        const left = text.slice(0, Math.ceil(size / 2));
        const right = text.slice(text.length - Math.floor(size / 2));
        const trimmed = left + separator + right;

        if (measure(trimmed)) {
            result = trimmed;
            low = size + 1;
        } else {
            high = size - 1;
        }
    }

    return result || text.charAt(0) + separator + text.charAt(text.length - 1);
};

const Truncate: ForwardRefRenderFunction<HTMLSpanElement, TruncateProps> = (props, ref) => {
    const {
        text = "",
        middle,
        separator = "...",
        className,
        highlight,
        ...other
    } = {...useComponentProps("truncate"), ...props};

    const innerRef = useRef<HTMLSpanElement | null>(null);
    const [displayedText, setDisplayedText] = useState(text);

    const finalText = useMemo(() => {
        return middle ? displayedText : text;
    }, [displayedText, text, middle]);

    useImperativeHandle(ref, () => innerRef.current!, []);

    useLayoutEffect(() => {
        const el = innerRef.current;
        if (!el || !middle) return;

        let observer: ResizeObserver | null = null;

        const measureAndTrim = debounce(() => {
            setDisplayedText(trimMiddle(el, text, separator));
        }, 150);

        measureAndTrim();

        observer = new ResizeObserver(() => measureAndTrim());

        observer.observe(el);

        return () => {
            measureAndTrim.clear();
            observer?.disconnect();
        };
    }, [text, separator, middle]);

    return (
        <span
            className={classnames(
                styles["truncate"],
                {
                    [styles["truncate--middle"]]: middle,
                },
                className
            )}
            {...other}
        >
            <span ref={innerRef} className={styles["truncate__hidden"]} />

            {highlight ? <Highlight {...highlight} textToHighlight={finalText} /> : finalText}
        </span>
    );
};

Truncate.displayName = "Truncate";

export default memo(forwardRef(Truncate));
