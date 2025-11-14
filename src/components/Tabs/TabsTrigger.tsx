import React, {forwardRef, ForwardRefRenderFunction, memo, useMemo} from "react";
import classnames from "classnames";

import {TabsTriggerProps as TabsTriggerRadixProps, Trigger} from "@radix-ui/react-tabs";
import {useComponentProps} from "../../providers";

import styles from "./tabs.module.scss";

export interface TabsTriggerProps extends TabsTriggerRadixProps {
    before?: number | string;
    after?: number | string;
    afterClassname?: string;
    beforeClassname?: string;
}

const TabsTrigger: ForwardRefRenderFunction<HTMLButtonElement, TabsTriggerProps> = (props, ref) => {
    const {
        after,
        before,
        className,
        afterClassname,
        beforeClassname,
        children,
        asChild = true,
        ...other
    } = {...useComponentProps("tabsTrigger"), ...props};

    return (
        <Trigger ref={ref} asChild={asChild} className={classnames(styles["tabs__trigger"], className)} {...other}>
            <div className={classnames(styles["tabs__trigger-wrapper"])}>
                {before &&
                    <span className={classnames(styles["tabs__trigger__before"], beforeClassname)}>{before}</span>}

                {typeof children === 'string' ? <span>{children}</span> : children}

                {after &&
                    <span className={classnames(styles["tabs__trigger__after"], afterClassname)}>{after}</span>}
            </div>
        </Trigger>
    );
};

export default memo(forwardRef(TabsTrigger));
