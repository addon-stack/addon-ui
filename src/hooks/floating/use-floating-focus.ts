import {type KeyboardEvent, useCallback, useEffect, useRef} from "react";

import {focusElement, getActiveElement, getTabbableElements} from "../../utils/dom/focus";
import {containsComposed, getShadowRoot} from "../../utils/dom/shadow";

import type {FloatingLayer} from "./context";
import {getOwnedLayers, isLiveLayer, isTopModal} from "./registry";
import type {FloatingLayerHandle} from "./use-floating-layer";

function ownsFocus(layer: FloatingLayer, element: Element | null) {
    return getOwnedLayers(layer).some(candidate => candidate.node && containsComposed(candidate.node, element));
}

export function useFloatingFocus({ref: layerRef, node, layer}: FloatingLayerHandle) {
    const opener = useRef<Element | null>(null);
    const mountedNode = useRef<HTMLDivElement | null>(null);
    const lastFocus = useRef<Element | null>(null);

    const ref = useCallback(
        (element: HTMLDivElement | null) => {
            // Capture before Radix autofocus; ref reattachment must not replace the original opener.
            if (element && element !== mountedNode.current) {
                opener.current = getActiveElement(element);
                mountedNode.current = element;
            }

            layerRef(element);
        },
        [layerRef]
    );

    useEffect(() => {
        if (!node || !layer.active || !layer.modal || !getShadowRoot(node)) {
            return;
        }

        const doc = node.ownerDocument;
        const root = getShadowRoot(node)!;
        let restoring = false;

        const restore = () => {
            if (restoring || !isLiveLayer(layer) || !isTopModal(layer)) {
                return;
            }

            const focused = getActiveElement(node);

            if (ownsFocus(layer, focused)) {
                lastFocus.current = focused;

                return;
            }

            restoring = true;

            const target =
                lastFocus.current?.isConnected && ownsFocus(layer, lastFocus.current)
                    ? lastFocus.current
                    : (getTabbableElements(node)[0] ?? node);

            focusElement(target);
            restoring = false;
        };

        // Capture sees the composed focus event even when a child stops propagation.
        doc.addEventListener("focusin", restore, true);
        // Focus transitions within one shadow tree are trimmed before reaching document.
        root.addEventListener("focusin", restore, true);

        const observer = new MutationObserver(() => {
            if (lastFocus.current && !lastFocus.current.isConnected) {
                restore();
            }
        });

        observer.observe(node.getRootNode(), {subtree: true, childList: true});

        return () => {
            doc.removeEventListener("focusin", restore, true);
            root.removeEventListener("focusin", restore, true);
            observer.disconnect();
        };
    }, [node, layer.active, layer.modal, layer]);

    const onOpenAutoFocus = (event: Event) => {
        if (event.defaultPrevented || !node || !getShadowRoot(node)) {
            return;
        }

        event.preventDefault();

        // An already focused nested layer owns its autofocus.
        if (!ownsFocus(layer, getActiveElement(node))) {
            focusElement(getTabbableElements(node)[0] ?? node);
        }

        lastFocus.current = getActiveElement(node);
    };

    const onCloseAutoFocus = (event: Event) => {
        if (event.defaultPrevented) {
            return;
        }

        event.preventDefault();

        if (opener.current?.isConnected) {
            focusElement(opener.current);
        }
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (
            event.defaultPrevented ||
            event.key !== "Tab" ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            !node ||
            !getShadowRoot(node) ||
            !isLiveLayer(layer)
        ) {
            return;
        }

        const focused = getActiveElement(node);

        if (getOwnedLayers(layer).some(
            candidate => candidate !== layer && containsComposed(candidate.node!, focused)
        )) {
            return;
        }

        const candidates = getTabbableElements(node);
        const index = candidates.indexOf(focused as HTMLElement);
        // Handle every Tab: native navigation can cross a shadow boundary before Radix sees it.
        event.preventDefault();

        const next =
            index < 0
                ? event.shiftKey
                    ? candidates.length - 1
                    : 0
                : (index + (event.shiftKey ? -1 : 1) + candidates.length) % candidates.length;

        focusElement(candidates[next] ?? node);
    };

    return {ref, onOpenAutoFocus, onCloseAutoFocus, onKeyDown};
}
