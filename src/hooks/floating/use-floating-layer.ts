import {type ForwardedRef, useCallback, useContext, useRef, useState} from "react";

import {getShadowRoot} from "../../utils/dom/shadow";

import {type FloatingLayer, FloatingLayerContext} from "./context";
import {registerLayer, unregisterLayer} from "./registry";

interface FloatingLayerOptions {
    ref: ForwardedRef<HTMLDivElement>;
    active?: boolean;
    modal?: boolean;
}

/** Registers React ancestry even when nested content uses a sibling portal target. */
export function useFloatingLayer({ref: forwardedRef, active = true, modal = false}: FloatingLayerOptions) {
    const parent = useContext(FloatingLayerContext);
    const [node, setNode] = useState<HTMLDivElement | null>(null);
    const layer = useRef<FloatingLayer>({node: null, parent, active, modal, order: 0, zIndex: 9999}).current;
    const mountedNode = useRef<HTMLDivElement | null>(null);
    layer.parent = parent;
    layer.active = active;
    layer.modal = modal;

    const parentZ = parent?.node
        ? Number(parent.node.ownerDocument.defaultView?.getComputedStyle(parent.node).zIndex)
        : NaN;

    layer.zIndex = parent ? Math.max(parent.zIndex, Number.isFinite(parentZ) ? parentZ : 0) + 2 : 9999;

    const zIndex =
        parent && ((node && getShadowRoot(node)) || (parent.node && getShadowRoot(parent.node)))
            ? layer.zIndex
            : undefined;

    const ref = useCallback(
        (element: HTMLDivElement | null) => {
            if (layer.node && layer.node !== element) {
                unregisterLayer(layer);
            }

            layer.node = element;

            if (element) {
                // Composed refs can detach and reattach the same node without opening a new layer.
                registerLayer(layer, element !== mountedNode.current);
                mountedNode.current = element;
            }

            setNode(element);

            if (typeof forwardedRef === "function") {
                forwardedRef(element);
            } else if (forwardedRef) {
                forwardedRef.current = element;
            }
        },
        [forwardedRef, layer]
    );

    return {ref, node, layer, zIndex};
}

export type FloatingLayerHandle = ReturnType<typeof useFloatingLayer>;
