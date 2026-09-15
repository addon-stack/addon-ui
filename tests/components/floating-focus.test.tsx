import React, {act} from "react";
import {createRoot, type Root} from "react-dom/client";

import {useFloatingFocus, useFloatingLayer} from "../../src/hooks/floating";
import {getActiveElement} from "../../src/utils/dom/focus";

function ModalLayer() {
    const layer = useFloatingLayer({ref: null, modal: true});
    const focus = useFloatingFocus(layer);

    return (
        <div ref={focus.ref} tabIndex={-1}>
            <button>Inside modal</button>
        </div>
    );
}

let roots: Root[];

beforeEach(() => {
    roots = [];
});

afterEach(async () => {
    await act(async () => roots.forEach(root => root.unmount()));
    document.body.replaceChildren();
});

async function mountModal(doc: Document) {
    const host = doc.body.appendChild(doc.createElement("div"));
    const shadow = host.attachShadow({mode: "open"});
    const root = createRoot(shadow);
    roots.push(root);
    await act(async () => root.render(<ModalLayer />));

    return {root, host, button: shadow.querySelector("button")!};
}

test("a modal in another document does not disable the current document's focus trap", async () => {
    const first = await mountModal(document);
    const iframe = document.body.appendChild(document.createElement("iframe"));
    await mountModal(iframe.contentDocument!);
    const outside = document.body.appendChild(document.createElement("button"));

    first.button.focus();
    outside.focus();

    expect(getActiveElement(first.host)).toBe(first.button);
});

test("independent shadow roots in the same document share modal order", async () => {
    const first = await mountModal(document);
    const second = await mountModal(document);
    const outside = document.body.appendChild(document.createElement("button"));

    outside.focus();
    expect(getActiveElement(second.host)).toBe(second.button);

    await act(async () => second.root.render(null));
    outside.focus();
    expect(getActiveElement(first.host)).toBe(first.button);
});
