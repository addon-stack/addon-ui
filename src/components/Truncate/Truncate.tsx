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

import styles from "./truncate.module.scss";

export interface TruncateProps extends ComponentProps<"span"> {
    text?: string;
    middle?: boolean;
    separator?: string;
    contentClassname?: string;
    render?: (text: string) => React.ReactNode;
}

const MAX_CACHE_SIZE = 1000;
const cache = new Map<string, string>();
let canvas: HTMLCanvasElement | null = null;

const addToCache = (key: string, value: string) => {
    if (cache.size >= MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined) {
            cache.delete(oldestKey);
        }
    }
    cache.set(key, value);
};

const calculateMiddleTruncate = (
    text: string,
    maxWidth: number,
    font: string,
    letterSpacing: string,
    separator: string
) => {
    const cacheKey = `${text}-${maxWidth}-${font}-${letterSpacing}-${separator}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    if (!canvas) {
        canvas = document.createElement("canvas");
    }
    const context = canvas.getContext("2d");
    if (!context) return text;
    context.font = font;
    context.letterSpacing = letterSpacing;

    const measure = (txt: string) => context.measureText(txt).width;

    if (measure(text) <= maxWidth) {
        addToCache(cacheKey, text);
        return text;
    }

    let low = 0;
    let high = text.length;
    let result = "";

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const leftHalf = Math.ceil(mid / 2);
        const rightHalf = Math.floor(mid / 2);

        const trimmed = text.slice(0, leftHalf) + separator + text.slice(text.length - rightHalf);

        if (measure(trimmed) <= maxWidth) {
            result = trimmed;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const finalResult = result || text[0] + separator + text.slice(-1);
    addToCache(cacheKey, finalResult);
    return finalResult;
};

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
