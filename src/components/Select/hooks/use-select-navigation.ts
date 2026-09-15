import {type FocusEvent, type KeyboardEvent, useRef} from "react";

import {focusElement, getActiveElement} from "../../../utils/dom/focus";
import {getShadowRoot} from "../../../utils/dom/shadow";

export function useSelectNavigation(open: boolean) {
    const search = useRef({value: "", time: 0});
    const initialFocus = useRef(false);

    if (!open) {
        initialFocus.current = false;
        search.current.value = "";
    }

    const items = (element: HTMLElement) =>
        Array.from(element.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled])'));

    const typeahead = (key: string, candidates: HTMLElement[], index: number) => {
        const now = Date.now();
        const value = (now - search.current.time < 1000 ? search.current.value : "") + key.toLocaleLowerCase();
        search.current = {value, time: now};
        const query = [...value].every(char => char === value[0]) ? value[0] : value;
        const start = query.length === 1 ? index + 1 : Math.max(0, index);

        return [...candidates.slice(start), ...candidates.slice(0, start)].find(item =>
            (item.dataset.addonUiText ?? item.textContent ?? "").trim().toLocaleLowerCase().startsWith(query)
        );
    };

    const onTypeaheadSpace = (event: KeyboardEvent<HTMLDivElement>) => {
        if (
            event.defaultPrevented ||
            event.key !== " " ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            !getShadowRoot(event.currentTarget) ||
            !search.current.value ||
            Date.now() - search.current.time >= 1000
        ) {
            return;
        }

        const content = event.currentTarget.closest<HTMLElement>('[role="listbox"]');

        if (!content) {
            return;
        }

        const candidates = items(content);
        event.preventDefault();
        const target = typeahead(" ", candidates, candidates.indexOf(getActiveElement(content) as HTMLElement));
        focusElement(target);
        target?.scrollIntoView({block: "nearest"});
    };

    const onFocus = (event: FocusEvent<HTMLDivElement>) => {
        if (
            event.defaultPrevented ||
            !getShadowRoot(event.currentTarget) ||
            initialFocus.current ||
            event.target !== event.currentTarget
        ) {
            return;
        }

        const candidates = items(event.currentTarget);

        if (!candidates.length) {
            return;
        }

        initialFocus.current = true;
        focusElement(candidates.find(item => item.dataset.state === "checked") ?? candidates[0]);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (
            event.defaultPrevented ||
            !getShadowRoot(event.currentTarget) ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
        ) {
            return;
        }

        const candidates = items(event.currentTarget);
        const active = getActiveElement(event.currentTarget);
        const index = candidates.indexOf(active as HTMLElement);
        const key = event.key;
        let target: HTMLElement | undefined;

        if (["ArrowUp", "ArrowDown", "Home", "End"].includes(key)) {
            search.current.value = "";

            if (key === "Home") {
                target = candidates[0];
            } else if (key === "End") {
                target = candidates[candidates.length - 1];
            } else {
                target =
                    candidates[
                        index < 0
                            ? key === "ArrowUp"
                                ? candidates.length - 1
                                : 0
                            : Math.max(0, Math.min(candidates.length - 1, index + (key === "ArrowUp" ? -1 : 1)))
                    ];
            }
        } else if (key.length === 1 && key !== " ") {
            target = typeahead(key, candidates, index);
        } else {
            return;
        }

        event.preventDefault();
        focusElement(target);
        target?.scrollIntoView({block: "nearest"});
    };

    return {onFocus, onKeyDown, onTypeaheadSpace};
}
