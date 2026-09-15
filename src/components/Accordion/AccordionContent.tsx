import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {type AccordionContentProps as AccordionContentRadixProps, Content} from "@radix-ui/react-accordion";

import classnames from "classnames";

import styles from "./accordion.module.scss?isolation";

export type AccordionContentProps = AccordionContentRadixProps;

const AccordionContent: ForwardRefRenderFunction<HTMLDivElement, AccordionContentProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Content ref={ref} className={classnames(styles["accordion-content"], className)} {...other} />;
};

export default memo(forwardRef(AccordionContent));
