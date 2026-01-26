import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import {
    Icon,
    SelectIconProps,
    SelectTriggerProps as SelectTriggerRadixProps,
    SelectValueProps,
    Trigger,
    Value,
} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

import styles from "./select.module.scss";

export interface SelectTriggerProps extends SelectTriggerRadixProps {
    center?: boolean;
    fullWidth?: boolean;
    ellipsis?: boolean;
    icon?: React.ReactNode;
    placeholder?: React.ReactNode;
    valueProps?: SelectValueProps;
    iconProps?: SelectIconProps;
}

const SelectTrigger: ForwardRefRenderFunction<HTMLButtonElement, SelectTriggerProps> = (props, ref) => {
    const {
        center,
        ellipsis = true,
        icon,
        placeholder,
        valueProps,
        iconProps,
        className,
        children,
        ...other
    } = {...useComponentProps("selectTrigger"), ...props};

    return (
        <Trigger
            ref={ref}
            className={classnames(
                styles["select__trigger"],
                {
                    [styles["select__trigger--center"]]: center,
                    [styles["select__trigger--ellipsis"]]: ellipsis,
                },
                className
            )}
            {...other}
        >
            {children && children}

            {!children && (
                <>
                    <Value placeholder={placeholder} {...valueProps} className={classnames(styles["select__value"])} />

                    {icon && (
                        <Icon className={classnames(styles["select__icon"], iconProps?.className)} {...iconProps}>
                            {icon}
                        </Icon>
                    )}
                </>
            )}
        </Trigger>
    );
};

export default memo(forwardRef(SelectTrigger));
