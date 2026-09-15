import React, {forwardRef, type ForwardRefRenderFunction, memo} from "react";

import {type AccordionTriggerProps as AccordionTriggerRadixProps, Trigger} from "@radix-ui/react-accordion";

import classnames from "classnames";

import styles from "./accordion.module.scss?isolation";

export type AccordionTriggerProps = AccordionTriggerRadixProps;

const AccordionTrigger: ForwardRefRenderFunction<HTMLButtonElement, AccordionTriggerProps> = (props, ref) => {
    const {className, asChild = true, ...other} = props;

    return (
        <Trigger
            ref={ref}
            asChild={asChild}
            className={classnames(styles["accordion-trigger"], className)}
            {...other}
        />
    );
};

export default memo(forwardRef(AccordionTrigger));
