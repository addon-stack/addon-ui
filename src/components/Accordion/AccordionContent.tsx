import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";
import classnames from "classnames";

import {AccordionContentProps as AccordionContentRadixProps, Content} from "@radix-ui/react-accordion";

import styles from "./accordion.module.scss";

export type AccordionContentProps = AccordionContentRadixProps;

const AccordionContent: ForwardRefRenderFunction<HTMLDivElement, AccordionContentProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Content ref={ref} className={classnames(styles["accordion-content"], className)} {...other} />;
};

export default memo(forwardRef(AccordionContent));
