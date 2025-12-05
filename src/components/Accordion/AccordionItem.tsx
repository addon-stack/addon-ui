import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";
import classnames from "classnames";

import {AccordionItemProps as AccordionItemRadixProps, Item} from "@radix-ui/react-accordion";

import styles from "./accordion.module.scss";

export type AccordionItemProps = AccordionItemRadixProps;

const AccordionItem: ForwardRefRenderFunction<HTMLDivElement, AccordionItemProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Item ref={ref} className={classnames(styles["accordion-item"], className)} {...other} />;
};

export default memo(forwardRef(AccordionItem));
