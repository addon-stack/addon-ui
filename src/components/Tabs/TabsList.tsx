import React, {
    forwardRef,
    ForwardRefRenderFunction,
    memo,
    useCallback,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import classnames from "classnames";
import _debounce from "lodash/debounce";

import {List, TabsListProps as TabsListRadixProps} from "@radix-ui/react-tabs";
import {useComponentProps} from "../../providers";

import styles from "./tabs.module.scss";

export interface TabsListProps extends TabsListRadixProps {
    separator?: boolean;
    indicator?: boolean;
    roundedEdges?: boolean;
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

    const listRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLSpanElement | null>(null);

    const [mounted, setMounted] = useState(false);
    const [modificators, setModificators] = useState<{ first?: boolean; last?: boolean }>({});

    useImperativeHandle(ref, () => listRef.current!, []);

    const updateIndicatorImmediate = useCallback(() => {
        const list = listRef.current;
        const indicator = indicatorRef.current;
        const activeTrigger = list?.querySelector("[data-state='active']") as HTMLElement | null;

        if (!list || !indicator || !activeTrigger) return;

        const triggers = Array.from(list.querySelectorAll("[data-state]")) as HTMLElement[];
        const first = triggers[0];
        const last = triggers[triggers.length - 1];

        const listRect = list.getBoundingClientRect();
        const triggerRect = activeTrigger.getBoundingClientRect();
        indicator.style.left = `${triggerRect.left - listRect.left + list.scrollLeft}px`;
        indicator.style.width = `${triggerRect.width}px`;

        setModificators({
            first: activeTrigger === first,
            last: activeTrigger === last,
        });
    }, []);

    const updateIndicator = useCallback(
        _debounce(updateIndicatorImmediate, 50),
        [updateIndicatorImmediate]
    );

    useLayoutEffect(() => {
        updateIndicatorImmediate();

        setMounted(true);

        const resizeObserver = new ResizeObserver(updateIndicator);
        const mutationObserver = new MutationObserver(updateIndicator);

        if (listRef.current) {
            resizeObserver.observe(listRef.current)

            mutationObserver.observe(listRef.current, {
                attributes: true,
                attributeFilter: ["data-state"],
                subtree: true,
                childList: true,
            });
        }

        window.addEventListener("resize", updateIndicator);

        return () => {
            window.removeEventListener("resize", updateIndicator);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            updateIndicator.cancel();
        };
    }, []);

    return (
        <List ref={listRef} className={classnames(styles["tabs__list"], {
            [styles["tabs__list--separator"]]: separator,
        }, className)} {...other}>
            {children}
            {mounted && (
                <span
                    ref={indicatorRef}
                    aria-hidden={!mounted || !indicator}
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

export default memo(forwardRef<HTMLDivElement, TabsListProps>(TabsList));
