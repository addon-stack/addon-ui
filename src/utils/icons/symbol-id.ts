export function createSymbolPrefix(): string {
    const random = crypto.getRandomValues(new Uint32Array(4));

    return `addon-ui-${Array.from(random, value => value.toString(16).padStart(8, "0")).join("")}`;
}

export function getSymbolId(prefix: string, name: string): string {
    // Encode Unicode code points, including underscores, so literal escape-like names remain distinct.
    const encoded = name.replace(/[^A-Za-z0-9-]/gu, character => `_${character.codePointAt(0)!.toString(16)}_`);

    return `${prefix}-${encoded}`;
}
