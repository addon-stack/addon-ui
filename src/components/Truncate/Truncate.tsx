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

export interface TruncateProps extends ComponentProps<'span'> {
    text?: string;
    middle?: boolean;
    separator?: string;
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
        text = '',
        middle,
        separator = "...",
        className,
        ...other
    } = {...useComponentProps("truncate"), ...props};

    const innerRef = useRef<HTMLSpanElement | null>(null);
    const [displayedText, setDisplayedText] = useState(text);

    useImperativeHandle(ref, () => innerRef.current!, []);

    useLayoutEffect(() => {
        const el = innerRef.current;
        if (!el || !middle) return;

        let animationFrameId: number;
        let observer: ResizeObserver | null = null;

        const measureAndTrim = () => {
            animationFrameId = requestAnimationFrame(() => {
                const newText = trimMiddle(el, text, separator);
                if (newText !== displayedText) {
                    setDisplayedText(newText);
                }
            });
        };

        measureAndTrim();

        if ("ResizeObserver" in window) {
            observer = new ResizeObserver(() => {
                cancelAnimationFrame(animationFrameId);
                measureAndTrim();
            });
            observer.observe(el);
        }

        return () => {
            observer?.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, separator, middle]);

    return (
        <span
            ref={innerRef}
            className={classnames(styles["truncate"], {
                [styles["truncate--middle"]]: middle
            }, className)}
            {...other}
        >
            {middle ? displayedText : text}
        </span>
    );
};

Truncate.displayName = "Truncate";

export default memo(forwardRef(Truncate));
