import React, {
    ChangeEventHandler,
    ComponentProps,
    forwardRef,
    memo,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import classnames from "classnames";

import {cloneOrCreateElement} from "../../utils";
import {useComponentProps} from "../../providers";

import {TextFieldVariant, TextFieldSize, TextFieldRadius, TextFieldAccent} from "./types";

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
        value: propValue = "",
        defaultValue,
        before,
        after,
        className,
        inputClassName,
        afterClassName,
        beforeClassName,
        onChange,
        ...other
    } = {...useComponentProps("textField"), ...props};

    const [value, setValue] = useState<string | number | undefined>(defaultValue || propValue);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
                setValue(value);
            },
        }),
        []
    );

    const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        event => {
            setValue(event.currentTarget.value);
            onChange?.(event);
        },
        [onChange]
    );

    useEffect(() => {
        setValue(propValue);
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
                type={type}
                value={value}
                defaultValue={defaultValue}
                aria-label={label}
                className={classnames(styles["text-field__input"], inputClassName)}
                onChange={handleChange}
            />
            {cloneOrCreateElement(after, {className: classnames(styles["text-field__after"], afterClassName)}, "span")}
        </div>
    );
});

export default memo(TextField);
