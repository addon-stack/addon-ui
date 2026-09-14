export function getShadowRoot(node: Node): ShadowRoot | undefined {
    const root = node.getRootNode();
    return root.nodeType === 11 && "host" in root ? (root as ShadowRoot) : undefined;
}

export function containsComposed(container: Node, node: Node | null): boolean {
    while (node) {
        if (container.contains(node)) return true;
        node = getShadowRoot(node)?.host ?? null;
    }
    return false;
}
