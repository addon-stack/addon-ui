import React, {type ComponentProps, forwardRef, type ForwardRefRenderFunction, memo} from "react";

import classnames from "classnames";

import styles from "./toggle-group.module.scss?isolation";

const ToggleGroupIndicator: ForwardRefRenderFunction<HTMLDivElement, ComponentProps<"div">> = (props, ref) => {
    const {children, className, ...other} = props;

    return (
        <div ref={ref} className={classnames(styles["toggle-group__indicator"], className)} {...other}>
            {children}
        </div>
    );
};

export default memo(forwardRef(ToggleGroupIndicator));
