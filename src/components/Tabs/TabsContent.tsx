import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";
import classnames from "classnames";

import {Content, TabsContentProps as TabsContentRadixProps} from "@radix-ui/react-tabs";
import {useComponentProps} from "../../providers";

import styles from "./tabs.module.scss";

export interface TabsContentProps extends TabsContentRadixProps {}

const TabsList: ForwardRefRenderFunction<HTMLDivElement, TabsContentProps> = (props, ref) => {
    const {
        className,
        children,
        ...other
    } = {...useComponentProps("tabsContent"), ...props};

    return (
        <Content ref={ref} className={classnames(styles["tabs__content"], className)} {...other}>
            {children}
        </Content>
    );
};

export default memo(forwardRef(TabsList));
