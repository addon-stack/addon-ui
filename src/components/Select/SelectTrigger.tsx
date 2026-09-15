import React, {forwardRef, type ForwardRefRenderFunction, memo, useContext} from "react";

import {useComposedRefs} from "@radix-ui/react-compose-refs";
import {
    Icon,
    type SelectIconProps,
    type SelectTriggerProps as SelectTriggerRadixProps,
    type SelectValueProps,
    Trigger,
    Value,
} from "@radix-ui/react-select";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import {SelectPortalContext} from "./context";

import styles from "./select.module.scss?isolation";

export interface SelectTriggerProps extends SelectTriggerRadixProps {
    center?: boolean;
    ellipsis?: boolean;
    icon?: React.ReactNode;
    placeholder?: React.ReactNode;
    valueProps?: SelectValueProps;
    iconProps?: SelectIconProps;
}

const SelectTrigger: ForwardRefRenderFunction<HTMLButtonElement, SelectTriggerProps> = (props, ref) => {
    const {setTrigger} = useContext(SelectPortalContext);
    const triggerRef = useComposedRefs(ref, setTrigger);

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
            ref={triggerRef}
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
