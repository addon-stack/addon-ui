import React, {FC, memo, useMemo} from "react";
import classnames from "classnames";
import Highlighter, {HighlighterProps} from "react-highlight-words";

import {useComponentProps} from "../../providers";

import {HighlightColor} from "./types";

import styles from "./highlight.module.scss";

export interface HighlightProps extends Omit<HighlighterProps, "searchWords"> {
    color?: HighlightColor;
    searchWords?: string | RegExp | (string | RegExp)[];
}

const Highlight: FC<HighlightProps> = props => {
    const {color, className, activeClassName, highlightClassName, searchWords, textToHighlight, ...other} = {
        ...useComponentProps("highlight"),
        ...props,
    };

    const search = useMemo(() => {
        if (!searchWords) {
            return [];
        }

        if (Array.isArray(searchWords)) {
            return searchWords;
        }

        return [searchWords];
    }, [searchWords]);

    return (
        <Highlighter
            className={classnames(
                styles["highlight"],
                {
                    [styles[`highlight--${color}-color`]]: color,
                },
                className
            )}
            highlightClassName={classnames(styles["highlight-mark"], highlightClassName)}
            activeClassName={classnames(styles["highlight-mark--active"], activeClassName)}
            searchWords={search}
            textToHighlight={textToHighlight}
            {...other}
        />
    );
};

export default memo(Highlight);
