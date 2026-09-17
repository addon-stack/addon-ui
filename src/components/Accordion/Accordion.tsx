import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {type AccordionMultipleProps, type AccordionSingleProps, Root} from "@radix-ui/react-accordion";

import classnames from "classnames";

import styles from "./accordion.module.scss";

export type AccordionProps = AccordionMultipleProps | AccordionSingleProps;

const Accordion: ForwardRefRenderFunction<HTMLDivElement, AccordionProps> = (props, ref) => {
    const {className, ...other} = props;

    return <Root ref={ref} className={classnames(styles["accordion"], className)} {...other} />;
};

export default memo(forwardRef(Accordion));
