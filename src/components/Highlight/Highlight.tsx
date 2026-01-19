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
    const {color, activeClassName, highlightClassName, searchWords, textToHighlight, ...other} = {
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
            highlightClassName={classnames(
                styles["highlight"],
                {
                    [styles[`highlight--${color}-color`]]: color,
                },
                highlightClassName
            )}
            searchWords={search}
            textToHighlight={textToHighlight}
            activeClassName={classnames(styles["highlight--active"], activeClassName)}
            {...other}
        />
    );
};

export default memo(Highlight);
