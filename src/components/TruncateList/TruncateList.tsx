import React, {forwardRef, memo, useCallback} from "react";
import classnames from "classnames";
import {OverflowList, OverflowListProps} from "react-responsive-overflow-list";

import {useComponentProps} from "../../providers";

import styles from "./truncate-list.module.scss";
import {Tag} from "../Tag";

export type TruncateListProps<T = unknown> = OverflowListProps<T> & {
    counterClassName?: string;
};

function TruncateListBase<T>(props: TruncateListProps<T>, ref: React.Ref<HTMLDivElement>) {
    const {
        renderOverflow,
        className,
        counterClassName,
        ...other
    } = {...useComponentProps("truncateList"), ...props};

    const RenderOverflow = useCallback((hiddenItems: T[]) => {
        if (renderOverflow) return renderOverflow(hiddenItems);

        return (
            <Tag className={classnames(styles["truncate-list__counter"], counterClassName)}>
                {`+${hiddenItems.length}`}
            </Tag>
        );
    }, [renderOverflow, counterClassName]);

    return (
        <OverflowList
            ref={ref}
            renderOverflow={RenderOverflow}
            className={classnames(styles["truncate-list"], className)}
            {...other as OverflowListProps<T>}
        />
    );
}

const TruncateList = memo(forwardRef(TruncateListBase)) as unknown as {
    <T>(props: TruncateListProps<T> & { ref?: React.Ref<HTMLDivElement> }): React.ReactElement | null;
    displayName?: string;
};

TruncateList.displayName = "TruncateList";

export default TruncateList;
