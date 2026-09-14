import {KeyboardEvent, useEffect, useState} from "react";
import {containsComposed, getShadowRoot} from "../../../utils/dom/shadow";
import {focusElement, getActiveElement, getTabbableElements} from "../../../utils/dom/focus";

const shadowViewports = new Set<HTMLOListElement>();

function candidates(viewport: HTMLOListElement) {
    return Array.from(viewport.children)
        .reverse()
        .flatMap(element => {
            const toast = element as HTMLElement;
            return toast.dataset.state === "open" ? [toast, ...getTabbableElements(toast)] : [];
        });
}

export function useShadowViewport() {
    const [viewport, ref] = useState<HTMLOListElement | null>(null);

    useEffect(() => {
        const region = viewport?.parentElement;
        if (!viewport || !region || !getShadowRoot(viewport)) return;
        const doc = viewport.ownerDocument;
        shadowViewports.add(viewport);
        const hotkey = (event: globalThis.KeyboardEvent) => {
            if (event.code !== "F8" || event.defaultPrevented) return;
            const target = [...shadowViewports]
                .filter(
                    candidate =>
                        candidate.ownerDocument === doc && candidate.isConnected && candidates(candidate).length
                )
                .at(-1);
            if (!target) return;
            // Empty providers in other shadow trees must not take the hotkey's focus.
            event.preventDefault();
            event.stopImmediatePropagation();
            focusElement(target);
        };
        const pointerLeave = (event: PointerEvent) => {
            // Radix's document.activeElement check otherwise resumes a focused toast.
            if (event.target === region && containsComposed(viewport, getActiveElement(viewport))) {
                event.stopImmediatePropagation();
            }
        };
        const focusProxy = (event: FocusEvent) => {
            const head = viewport.previousElementSibling;
            const tail = viewport.nextElementSibling;
            if (
                (event.target !== head && event.target !== tail) ||
                containsComposed(viewport, event.relatedTarget as Node | null)
            )
                return;
            const items = candidates(viewport);
            if (!items.length) return;
            event.stopImmediatePropagation();
            focusElement(event.target === head ? items[0] : items[items.length - 1]);
        };
        region.addEventListener("pointerleave", pointerLeave, true);
        region.addEventListener("focus", focusProxy, true);
        doc.addEventListener("keydown", hotkey, true);
        return () => {
            shadowViewports.delete(viewport);
            doc.removeEventListener("keydown", hotkey, true);
            region.removeEventListener("pointerleave", pointerLeave, true);
            region.removeEventListener("focus", focusProxy, true);
        };
    }, [viewport]);

    const handlesKey = (event: KeyboardEvent<HTMLElement>) =>
        !!viewport &&
        !!getShadowRoot(viewport) &&
        event.key === "Tab" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey;

    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!viewport || !handlesKey(event)) return;
        // Radix's native listener ignores defaultPrevented. Intercept shadow Tab
        // during capture after the Toast's user callbacks have run.
        event.nativeEvent.stopImmediatePropagation();
        if (event.defaultPrevented) return;
        const items = candidates(viewport);
        const index = items.indexOf(getActiveElement(viewport) as HTMLElement);
        const next = index + (event.shiftKey ? -1 : 1);
        if (items[next]) {
            event.preventDefault();
            focusElement(items[next]);
        } else {
            // Native Tab continues outside the viewport from Radix's boundary proxy.
            focusElement(event.shiftKey ? viewport.previousElementSibling : viewport.nextElementSibling);
        }
    };

    const onKeyDownCapture = (event: KeyboardEvent<HTMLOListElement>) => {
        // The F8 hotkey focuses the viewport itself, outside the Toast Root portal.
        if (event.target === event.currentTarget) onKeyDown(event);
    };

    return {ref, node: viewport, handlesKey, onKeyDown, onKeyDownCapture};
}
