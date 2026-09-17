// Self-contained so this probe can run through Playwright or Firefox RDP.
export function readIconIds(element) {
    const section = typeof element === "string" ? document.querySelector(element) : element;
    const root = section.getRootNode();
    const symbols = [...section.querySelectorAll("symbol")].map(symbol => symbol.id);

    const uses = [...section.querySelectorAll("[data-icon-id-case] use")].map(use => {
        const id = use.getAttribute("href").slice(1);
        const symbol = root.getElementById(id);

        return {
            key: use.parentElement.getAttribute("data-icon-id-case"),
            id,
            name: symbol?.getAttribute("data-icon"),
            tag: symbol?.tagName,
            width: use.getBBox().width,
        };
    });

    return {symbols, uses};
}
