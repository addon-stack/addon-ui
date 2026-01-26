import React, {
    ChangeEventHandler,
    ComponentProps,
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import classnames from "classnames";
import autosize from "autosize";

import {useComponentProps} from "../../providers";

import {TextAreaVariant, TextAreaSize, TextAreaRadius} from "./types";

import styles from "./text-area.module.scss";

export interface TextAreaActions {
    select(): void;

    focus(): void;

    setValue(value: string): void;
}

export interface TextAreaProps extends ComponentProps<"textarea"> {
    variant?: TextAreaVariant;
    radius?: TextAreaRadius;
    size?: TextAreaSize;
    fullWidth?: boolean;
    label?: string;
    children?: string | ReadonlyArray<string> | number | undefined;
}

const TextArea = forwardRef<TextAreaActions, TextAreaProps>((props, ref) => {
    const {
        variant = TextAreaVariant.Regular,
        radius,
        size,
        fullWidth,
        label,
        id,
        name,
        rows = 4,
        value: propValue = "",
        children,
        onChange,
        className,
        ...other
    } = {...useComponentProps("textArea"), ...props};

    const [value, setValue] = useState(propValue || children);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
        event => {
            setValue(event.currentTarget.value);
            onChange?.(event);
        },
        [onChange]
    );

    useImperativeHandle(
        ref,
        () => ({
            select() {
                textareaRef.current?.select();
            },
            focus() {
                textareaRef.current?.focus();
            },
            setValue(value: string) {
                setValue(value);
            },
        }),
        []
    );

    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            autosize(textarea);
        }

        return () => {
            if (textarea) {
                autosize.destroy(textarea);
            }
        };
    }, []);

    useEffect(() => {
        setValue(propValue || children);
    }, [propValue, children]);

    return (
        <textarea
            {...other}
            ref={textareaRef}
            id={id}
            name={name || id}
            value={value}
            rows={rows}
            aria-label={label}
            onChange={handleChange}
            className={classnames(
                styles["text-area"],
                {
                    [styles[`text-area--${variant}`]]: variant,
                    [styles[`text-area--${size}-size`]]: size,
                    [styles[`text-area--${radius}-radius`]]: radius,
                    [styles["text-area--full-width"]]: fullWidth,
                },
                className
            )}
        />
    );
});

export default memo(TextArea);
