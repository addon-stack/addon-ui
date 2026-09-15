import type {FloatingLayer} from "./context";

// All roots in one document share modal ordering; separate documents stay independent.
const registries = new WeakMap<Document, {layers: Set<FloatingLayer>; order: number}>();

export function registerLayer(layer: FloatingLayer, newMount: boolean) {
    const doc = layer.node?.ownerDocument;

    if (!doc) {
        return;
    }

    let registry = registries.get(doc);

    if (!registry) {
        registry = {layers: new Set(), order: 0};
        registries.set(doc, registry);
    }

    if (newMount) {
        layer.order = ++registry.order;
    }

    registry.layers.add(layer);
}

export function unregisterLayer(layer: FloatingLayer) {
    const doc = layer.node?.ownerDocument;

    if (doc) {
        registries.get(doc)?.layers.delete(layer);
    }
}

function layersFor(layer: FloatingLayer) {
    const doc = layer.node?.ownerDocument;

    return doc ? [...(registries.get(doc)?.layers ?? [])] : [];
}

function isChild(layer: FloatingLayer, parent: FloatingLayer): boolean {
    for (let current = layer.parent; current; current = current.parent) {
        if (current === parent) {
            return true;
        }
    }

    return false;
}

export function isLiveLayer(layer: FloatingLayer) {
    return layer.active && layer.node?.isConnected && layer.node.dataset.state !== "closed";
}

export function getOwnedLayers(layer: FloatingLayer) {
    return layersFor(layer).filter(
        candidate => isLiveLayer(candidate) && (candidate === layer || isChild(candidate, layer))
    );
}

export function isTopModal(layer: FloatingLayer) {
    return !layersFor(layer).some(
        candidate =>
            candidate !== layer &&
            isLiveLayer(candidate) &&
            candidate.modal &&
            (isChild(candidate, layer) || (!isChild(layer, candidate) && candidate.order > layer.order))
    );
}
