import {Tag} from "addon-ui";
import React from "react";
import styles from "./lazy.module.scss?isolation";
export default function LazyPanel() {
    return (
        <Tag className={styles.lazy} data-testid="lazy">
            Lazy CSS loaded
        </Tag>
    );
}
