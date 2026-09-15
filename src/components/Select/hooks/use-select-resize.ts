import {useCallback, useLayoutEffect, useRef} from "react";

/** Radix closes on every resize, including Chrome popup events with unchanged dimensions. */
export function useSelectResize(open: boolean, ownerWindow: Window | null) {
    const unchangedResize = useRef<Event | null>(null);

    // Subscribe before Radix installs its resize closer in a passive effect.
    useLayoutEffect(() => {
        if (!open || !ownerWindow) {
            return;
        }

        let width = ownerWindow.innerWidth;
        let height = ownerWindow.innerHeight;

        const onResize = (event: Event) => {
            unchangedResize.current = ownerWindow.innerWidth === width && ownerWindow.innerHeight === height
                ? event : null;

            width = ownerWindow.innerWidth;
            height = ownerWindow.innerHeight;
        };

        ownerWindow.addEventListener("resize", onResize, true);

        return () => {
            ownerWindow.removeEventListener("resize", onResize, true);
            unchangedResize.current = null;
        };
    }, [open, ownerWindow]);

    return useCallback((nextOpen: boolean) => {
        const event = unchangedResize.current;
        // Only suppress a close during this dispatch. Microtasks can run between
        // native listeners, so clearing a boolean in a microtask is too early.
        const ignoreClose = !nextOpen && event !== null && event.eventPhase !== event.NONE;
        unchangedResize.current = null;

        return ignoreClose;
    }, []);
}
