import React, {forwardRef, ForwardRefRenderFunction, memo} from "react";
import classnames from "classnames";

import {AccordionTriggerProps as AccordionTriggerRadixProps, Trigger} from "@radix-ui/react-accordion";

import styles from "./accordion.module.scss";

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
