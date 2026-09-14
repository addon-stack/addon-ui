import {getShadowRoot} from "./shadow";

export function getActiveElement(node: Node): Element | null {
    let active = getShadowRoot(node)?.activeElement ?? node.ownerDocument?.activeElement ?? null;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
}

export function focusElement(element: Element | null | undefined) {
    if (element && "focus" in element) (element as HTMLElement).focus({preventScroll: true});
}

/** Collects visible controls in tab order, including open shadow trees and slots. */
export function getTabbableElements(container: HTMLElement): HTMLElement[] {
    const candidates: HTMLElement[] = [];
    const visit = (element: Element) => {
        const style = element.ownerDocument.defaultView?.getComputedStyle(element);
        if (element.matches("[hidden], [inert]") || style?.display === "none" || style?.visibility === "hidden") return;
        if ((element as HTMLElement).tabIndex >= 0 && !element.matches(":disabled, input[type=hidden]")) {
            candidates.push(element as HTMLElement);
        }
        const children =
            element.shadowRoot?.children ??
            (element.tagName === "SLOT"
                ? (element as HTMLSlotElement).assignedElements({flatten: true})
                : element.children);
        Array.from(children).forEach(visit);
    };
    Array.from(container.children).forEach(visit);
    return candidates
        .filter(element => {
            if (!element.matches("input[type=radio][name]")) return true;
            const radio = element as HTMLInputElement;
            const group = candidates.filter(
                candidate =>
                    candidate.matches("input[type=radio]") &&
                    (candidate as HTMLInputElement).name === radio.name &&
                    (candidate as HTMLInputElement).form === radio.form
            );
            return (group.find(candidate => (candidate as HTMLInputElement).checked) ?? group[0]) === element;
        })
        .sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity));
}
