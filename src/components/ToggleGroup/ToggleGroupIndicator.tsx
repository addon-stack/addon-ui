import React, {forwardRef, ForwardRefRenderFunction, memo, ComponentProps} from "react";

import classnames from "classnames";

import styles from "./toggleGroup.module.scss";

const ToggleGroupIndicator: ForwardRefRenderFunction<HTMLDivElement, ComponentProps<"div">> = (props, ref) => {
    const {children, className, ...other} = props;

    return (
        <div ref={ref} className={classnames(styles["toggle-group__indicator"], className)} {...other}>
            {children}
        </div>
    );
};

export default memo(forwardRef(ToggleGroupIndicator));
