import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {Content, type TabsContentProps as TabsContentRadixProps} from "@radix-ui/react-tabs";

import classnames from "classnames";

import {useComponentProps} from "../../providers";

import styles from "./tabs.module.scss";

export type TabsContentProps = TabsContentRadixProps;

const TabsContent: ForwardRefRenderFunction<HTMLDivElement, TabsContentProps> = (props, ref) => {
    const {className, children, ...other} = {...useComponentProps("tabsContent"), ...props};

    return (
        <Content ref={ref} className={classnames(styles["tabs__content"], className)} {...other}>
            {children}
        </Content>
    );
};

export default memo(forwardRef(TabsContent));
