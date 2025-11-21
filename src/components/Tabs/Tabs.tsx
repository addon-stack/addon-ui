import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";
import classnames from "classnames";

import {Root, TabsProps as TabsRadixProps} from "@radix-ui/react-tabs";
import {useComponentProps} from "../../providers";

import styles from "./tabs.module.scss";

export interface TabsProps extends Omit<TabsRadixProps, "orientation"> {
    reverse?: boolean;
}
const Tabs: ForwardRefRenderFunction<HTMLDivElement, TabsProps> = (props, ref) => {
    const {reverse, className, children, ...other} = {...useComponentProps("tabs"), ...props};

    return (
        <Root
            ref={ref}
            className={classnames(
                styles["tabs"],
                {
                    [styles["tabs--reverse"]]: reverse,
                },
                className
            )}
            {...other}
        >
            {children}
        </Root>
    );
};

export default memo(forwardRef(Tabs));
