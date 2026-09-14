import React, {useLayoutEffect, useRef} from "react";
import {containsComposed, getShadowRoot} from "../../utils/dom/shadow";
import {focusElement, getActiveElement} from "../../utils/dom/focus";

/** Lives inside Radix Presence, so cleanup can inspect focus before the toast is removed. */
export function ToastFocusRestore({viewport}: {viewport: HTMLOListElement | null}) {
    const ref = useRef<HTMLSpanElement>(null);
    useLayoutEffect(() => {
        const marker = ref.current;
        const toast = marker?.parentElement;
        if (!marker || !toast || !viewport || !getShadowRoot(toast)) return;
        return () => {
            const focused = getActiveElement(toast);
            if (!containsComposed(toast, focused)) return;
            // Check the completed commit: StrictMode replays cleanup without removing
            // the marker, and removing the entire Toast also removes its viewport.
            queueMicrotask(() => {
                if (marker.isConnected || !viewport.isConnected) return;
                if (toast.isConnected && toast.dataset.state !== "closed") return;
                const active = getActiveElement(viewport);
                if (!active || active === viewport.ownerDocument.body || containsComposed(toast, active)) {
                    focusElement(viewport);
                }
            });
        };
    }, [viewport]);
    return <span ref={ref} hidden />;
}
