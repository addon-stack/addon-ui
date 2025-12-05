import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";
import classnames from "classnames";

import {AccordionHeaderProps as AccordionHeaderRadixProps, Header} from "@radix-ui/react-accordion";

import styles from "./accordion.module.scss";

export type AccordionHeaderProps = AccordionHeaderRadixProps;

const AccordionHeader: ForwardRefRenderFunction<HTMLDivElement, AccordionHeaderProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Header ref={ref} className={classnames(styles["accordion-header"], className)} {...other} />;
};

export default memo(forwardRef(AccordionHeader));
