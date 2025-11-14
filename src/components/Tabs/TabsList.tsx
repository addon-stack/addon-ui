import React, {forwardRef, ForwardRefRenderFunction, memo, useEffect, useRef, useState} from "react";
import classnames from "classnames";

import {List, TabsListProps as TabsListRadixProps} from "@radix-ui/react-tabs";
import {useComponentProps} from "../../providers";

import styles from "./tabs.module.scss";

export interface TabsListProps extends TabsListRadixProps {
    separator?: boolean
    indicator?: boolean
    roundedEdges?: boolean
    indicatorClassname?: string;
}

const TabsList: ForwardRefRenderFunction<HTMLDivElement, TabsListProps> = (props, ref) => {
    const {
        separator = true,
        indicator = true,
        roundedEdges,
        className,
        indicatorClassname,
        children,
        ...other
    } = {...useComponentProps("tabsList"), ...props};

    const listRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);

    const [mounted, setMounted] = useState(false);
    const [modificators, setModificators] = useState<{ first?: boolean; last?: boolean }>({});

    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(listRef.current);
        } else {
            ref.current = listRef.current;
        }
    }, [ref]);


    useEffect(() => {
        const updateIndicator = () => {
            const list = listRef.current;
            const indicator = indicatorRef.current;
            const activeTrigger = list?.querySelector("[data-state='active']") as HTMLElement | null;

            if (!list || !indicator || !activeTrigger) return;

            const triggers = Array.from(list.querySelectorAll("[data-state]")) as HTMLElement[];
            const first = triggers[0];
            const last = triggers[triggers.length - 1];

            const listRect = list.getBoundingClientRect();
            const triggerRect = activeTrigger.getBoundingClientRect();
            indicator.style.left = `${triggerRect.left - listRect.left}px`;
            indicator.style.width = `${triggerRect.width}px`;


            setModificators({
                first: activeTrigger === first,
                last: activeTrigger === last,
            });
        };

        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        setMounted(true);

        const observer = new MutationObserver(updateIndicator);
        if (listRef.current) {
            observer.observe(listRef.current, {attributes: true, subtree: true});
        }

        return () => {
            window.removeEventListener("resize", updateIndicator);
            observer.disconnect();
        };
    }, []);

    return (
        <List ref={listRef} className={classnames(styles["tabs__list"],{
            [styles["tabs__list--separator"]]: separator,
        }, className)} {...other}>
            {children}
            {mounted && (
                <span
                    ref={indicatorRef}
                    className={classnames(styles["tabs__indicator"], {
                        [styles["tabs__indicator--show"]]: indicator,
                        [styles["tabs__indicator--rounded_edges"]]: roundedEdges,
                        [styles["tabs__indicator--first"]]: modificators.first,
                        [styles["tabs__indicator--last"]]: modificators.last,
                    }, indicatorClassname)}
                />
            )}
        </List>
    );
};

export default memo(forwardRef(TabsList));
