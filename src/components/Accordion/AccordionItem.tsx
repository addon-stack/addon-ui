import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {type AccordionItemProps as AccordionItemRadixProps, Item} from "@radix-ui/react-accordion";

import classnames from "classnames";

import styles from "./accordion.module.scss?isolation";

export type AccordionItemProps = AccordionItemRadixProps;

const AccordionItem: ForwardRefRenderFunction<HTMLDivElement, AccordionItemProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Item ref={ref} className={classnames(styles["accordion-item"], className)} {...other} />;
};

export default memo(forwardRef(AccordionItem));
