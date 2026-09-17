import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {type AccordionHeaderProps as AccordionHeaderRadixProps, Header} from "@radix-ui/react-accordion";

import classnames from "classnames";

import styles from "./accordion.module.scss";

export type AccordionHeaderProps = AccordionHeaderRadixProps;

const AccordionHeader: ForwardRefRenderFunction<HTMLDivElement, AccordionHeaderProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Header ref={ref} className={classnames(styles["accordion-header"], className)} {...other} />;
};

export default memo(forwardRef(AccordionHeader));
