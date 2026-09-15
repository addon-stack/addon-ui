import React, {act, StrictMode, useState} from "react";
import {createRoot, type Root} from "react-dom/client";

import Toast, {type ToastProps} from "../../src/components/Toast/Toast";

let root: Root;
let shadow: ShadowRoot;
let outside: HTMLButtonElement;

beforeEach(() => {
    const host = document.body.appendChild(document.createElement("div"));
    shadow = host.attachShadow({mode: "open"});
    root = createRoot(shadow.appendChild(document.createElement("div")));
    outside = document.body.appendChild(document.createElement("button"));
});

afterEach(async () => {
    await act(async () => root.unmount());
    document.body.replaceChildren();
});

const render = async (props: ToastProps = {}) => {
    await act(async () =>
        root.render(
            <Toast
                duration={Infinity}
                title="Notice"
                onClose={() => {}}
                action={
                    <div>
                        <button data-action="" autoFocus>
                            Action
                        </button>
                        <button disabled>Disabled</button>
                    </div>
                }
                {...props}
            />
        )
    );
};

const viewport = () => shadow.querySelector<HTMLOListElement>("ol")!;
const toast = () => viewport().querySelector<HTMLLIElement>("li")!;
const action = () => toast().querySelector<HTMLButtonElement>("[data-action]")!;
const close = () => toast().querySelector<HTMLButtonElement>('[aria-label="Close"]')!;
const focus = async (element: HTMLElement) => act(async () => element.focus());

const key = async (value: string, shiftKey = false) => {
    const event = new KeyboardEvent("keydown", {
        key: value,
        code: value,
        shiftKey,
        bubbles: true,
        composed: true,
        cancelable: true,
    });

    await act(async () => shadow.activeElement!.dispatchEvent(event));

    return event;
};

test("Tab and Shift+Tab follow notification order and skip disabled controls", async () => {
    await render();
    await focus(viewport());
    expect((await key("Tab")).defaultPrevented).toBe(true);
    expect(shadow.activeElement).toBe(toast());
    await key("Tab");
    expect(shadow.activeElement).toBe(action());
    await key("Tab");
    expect(shadow.activeElement).toBe(close());
    await key("Tab", true);
    expect(shadow.activeElement).toBe(action());
    await key("Tab", true);
    expect(shadow.activeElement).toBe(toast());
});

test.each(["onKeyDown", "onKeyDownCapture"] as const)("respects %s preventDefault", async handler => {
    const callback = jest.fn(event => event.preventDefault());
    await render({[handler]: callback});
    await focus(action());
    expect((await key("Tab")).defaultPrevented).toBe(true);
    expect(shadow.activeElement).toBe(action());
    expect(callback).toHaveBeenCalledTimes(1);
});

test("Escape restores viewport focus for an uncontrolled toast", async () => {
    const onOpenChange = jest.fn();
    await render({onOpenChange});
    await focus(action());
    await key("Escape");
    expect(toast()).toBeNull();
    expect(shadow.activeElement).toBe(viewport());
    expect(onOpenChange).toHaveBeenCalledWith(false);
});

test.each([undefined, true] as const)("controlled closing restores focus with forceMount=%s", async forceMount => {
    await render({open: true, forceMount});
    await focus(action());
    await render({open: false, forceMount});
    expect(shadow.activeElement).toBe(viewport());

    if (forceMount) {
        expect(toast().dataset.state).toBe("closed");
    } else {
        expect(toast()).toBeNull();
    }
});

test("forceMount also restores focus after an uncontrolled Escape", async () => {
    await render({forceMount: true});
    await focus(action());
    await key("Escape");
    expect(toast().dataset.state).toBe("closed");
    expect(shadow.activeElement).toBe(viewport());
});

test("the library's close button restores viewport focus", async () => {
    function Example() {
        const [open, setOpen] = useState(true);

        return <Toast open={open} duration={Infinity} title="Notice" onClose={() => setOpen(false)} />;
    }

    await act(async () => root.render(<Example />));
    await focus(close());
    await act(async () => close().click());
    expect(toast()).toBeNull();
    expect(shadow.activeElement).toBe(viewport());
});

test("does not steal focus when the user has left the toast", async () => {
    await render({open: true});
    await focus(outside);
    await render({open: false});
    expect(document.activeElement).toBe(outside);
});

test("does not override focus moved by a close callback", async () => {
    await render({onOpenChange: () => outside.focus()});
    await focus(action());
    await key("Escape");
    expect(document.activeElement).toBe(outside);
});

test("does not focus a viewport removed with the whole Toast", async () => {
    await render();
    await focus(action());
    const target = viewport();
    const spy = jest.spyOn(target, "focus");
    await act(async () => root.render(null));
    expect(target.isConnected).toBe(false);
    expect(spy).not.toHaveBeenCalled();
});

test("StrictMode cleanup and ordinary updates preserve focus in an open toast", async () => {
    const example = (title: string) => (
        <StrictMode>
            <Toast
                title={title}
                duration={Infinity}
                action={
                    <button data-action="" autoFocus>
                        Action
                    </button>
                }
            />
        </StrictMode>
    );

    await act(async () => root.render(example("First")));
    expect(shadow.activeElement).toBe(action());
    await act(async () => root.render(example("Updated")));
    expect(shadow.activeElement).toBe(action());
});

test("preventDefault on Escape keeps the toast and its focus", async () => {
    await render({onEscapeKeyDown: event => event.preventDefault()});
    await focus(action());
    await key("Escape");
    expect(toast()).not.toBeNull();
    expect(shadow.activeElement).toBe(action());
});

test("ordinary DOM keeps Radix Escape focus restoration", async () => {
    await act(async () => root.unmount());
    const mount = document.body.appendChild(document.createElement("div"));
    root = createRoot(mount);
    await act(async () => root.render(<Toast duration={Infinity} action={<button>Action</button>} />));
    const target = mount.querySelector("ol")!;
    const action = target.querySelector("button")!;

    await act(async () => {
        action.focus();
        action.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true, cancelable: true}));
    });

    expect(target.querySelector("li")).toBeNull();
    expect(document.activeElement).toBe(target);
});
