import React, {
    ChangeEvent,
    ComponentProps,
    forwardRef,
    KeyboardEvent,
    memo,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import classnames from "classnames";

import {cloneOrCreateElement} from "../../utils";
import {useComponentProps} from "../../providers";

import {normalizeNumberInput} from "./utils";
import {TextFieldAccent, TextFieldRadius, TextFieldSize, TextFieldVariant} from "./types";

import styles from "./text-field.module.scss";

export interface TextFieldActions {
    select(): void;

    focus(): void;

    getValue(): string | undefined;

    setValue(value: string | number | undefined): void;
}

export interface TextFieldProps extends ComponentProps<"input"> {
    variant?: TextFieldVariant;
    accent?: TextFieldAccent;
    radius?: TextFieldRadius;
    customSize?: TextFieldSize;
    value?: string | number | undefined;
    defaultValue?: string | number | undefined;
    label?: string;
    fullWidth?: boolean;
    before?: ReactNode;
    after?: ReactNode;
    inputClassName?: string;
    afterClassName?: string;
    beforeClassName?: string;
    strict?: boolean;
}

const TextField = forwardRef<TextFieldActions, TextFieldProps>((props, ref) => {
    const {
        variant = TextFieldVariant.Regular,
        accent,
        radius,
        customSize,
        label,
        fullWidth,
        type = "text",
        strict,
        value: propValue,
        defaultValue,
        before,
        after,
        className,
        inputClassName,
        afterClassName,
        beforeClassName,
        onChange,
        onKeyDown,
        ...other
    } = {...useComponentProps("textField"), ...props};

    const [value, setValue] = useState<string>(() => {
        if (propValue != null) return String(propValue);
        if (defaultValue != null) return String(defaultValue);
        return "";
    });

    const inputRef = useRef<HTMLInputElement | null>(null);

    const strictNumberType = useMemo(() => type === "number" && !!strict, [type, strict]);

    useImperativeHandle(
        ref,
        () => ({
            select() {
                inputRef.current?.select();
            },
            focus() {
                inputRef.current?.focus();
            },
            getValue(): string | undefined {
                return inputRef.current?.value;
            },
            setValue(value: string | number | undefined) {
                setValue(value == null ? "" : String(value));
            },
        }),
        []
    );

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            let newValue = event.currentTarget.value ?? "";

            if (strictNumberType) {
                newValue = normalizeNumberInput(newValue);
            }

            setValue(newValue);

            onChange?.({
                ...event,
                currentTarget: {
                    ...event.currentTarget,
                    value: newValue,
                },
            });
        },
        [onChange, strictNumberType]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (strictNumberType && event.key.length === 1) {
                // Only handle single-character printable keys here
                // composition and paste handled in onChange
                const {selectionStart, selectionEnd, value} = event.currentTarget;

                const start = selectionStart ?? value.length;
                const end = selectionEnd ?? start;

                const next = value.slice(0, start) + event.key + value.slice(end);
                const normalized = normalizeNumberInput(next);

                if (normalized !== next) {
                    event.preventDefault();
                }
            }

            onKeyDown?.(event);
        },
        [onKeyDown, strictNumberType]
    );

    useEffect(() => {
        const text = propValue == null ? "" : String(propValue);

        setValue(strictNumberType ? normalizeNumberInput(text) : text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propValue]);

    return (
        <div
            aria-label={label}
            className={classnames(
                styles["text-field"],
                {
                    [styles[`text-field--${variant}`]]: variant,
                    [styles[`text-field--${accent}`]]: accent,
                    [styles[`text-field--${radius}-radius`]]: radius,
                    [styles[`text-field--${customSize}-size`]]: customSize,
                    [styles["text-field--full-width"]]: fullWidth,
                },
                className
            )}
        >
            {cloneOrCreateElement(
                before,
                {className: classnames(styles["text-field__before"], beforeClassName)},
                "span"
            )}
            <input
                {...other}
                ref={inputRef}
                type={strictNumberType ? "text" : type}
                inputMode={strictNumberType ? "decimal" : other.inputMode}
                value={value}
                aria-label={label}
                className={classnames(styles["text-field__input"], inputClassName)}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {cloneOrCreateElement(after, {className: classnames(styles["text-field__after"], afterClassName)}, "span")}
        </div>
    );
});

export default memo(TextField);
