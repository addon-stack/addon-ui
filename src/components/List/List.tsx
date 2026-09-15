import React, {type ComponentProps, forwardRef, memo, type ReactElement} from "react";

import classnames from "classnames";

import {useComponentProps} from "../../providers";
import type {ListItemProps} from "../ListItem";

import styles from "./list.module.scss?isolation";

export interface ListProps extends Omit<ComponentProps<"ul">, "children"> {
    children: ReactElement<ListItemProps> | ReactElement<ListItemProps>[];
}

const List = forwardRef<HTMLUListElement, ListProps>((props, ref) => {
    const {children, className, ...other} = {...useComponentProps("list"), ...props};

    return (
        <ul {...other} ref={ref} className={classnames(styles["list"], className)}>
            {children}
        </ul>
    );
});

export default memo(List);
