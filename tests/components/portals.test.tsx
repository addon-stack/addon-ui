import React, {act, ReactNode} from "react";
import {createRoot, Root} from "react-dom/client";
import {UIProvider} from "../../src/providers";
import Modal from "../../src/components/Modal/Modal";
import Drawer from "../../src/components/Drawer/Drawer";
import Dialog from "../../src/components/Dialog/Dialog";
import Tooltip from "../../src/components/Tooltip/Tooltip";
import Footer from "../../src/components/Footer/Footer";
import Popover from "../../src/components/Popover/Popover";
import PopoverContent from "../../src/components/Popover/PopoverContent";
import Select from "../../src/components/Select/Select";
import SelectContent from "../../src/components/Select/SelectContent";
import SelectTrigger from "../../src/components/Select/SelectTrigger";
import SelectItem from "../../src/components/Select/SelectItem";
import config from "../../src/config/default";
import type {ComponentsProps} from "../../src/types/config";

let root: Root;
let mount: HTMLDivElement;
let provider: HTMLDivElement;
let configured: HTMLDivElement;
let explicit: HTMLDivElement;
beforeEach(() => {
    [mount, provider, configured, explicit] = Array.from({length: 4}, () =>
        document.body.appendChild(document.createElement("div"))
    );
    root = createRoot(mount);
});
afterEach(async () => {
    await act(async () => root.unmount());
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
    });
    document.body.replaceChildren();
    config.components = {};
});
const render = async (
    children: ReactNode,
    portal?: Element | DocumentFragment | null,
    components?: ComponentsProps
) => {
    await act(async () =>
        root.render(
            <UIProvider container={false} portal={portal} components={components}>
                {children}
            </UIProvider>
        )
    );
};
const fixtures = [
    [
        "dialog",
        (container?: Element | DocumentFragment | null) => (
            <Dialog open container={container} title="Test" description="Test">
                <button data-probe="">Dialog</button>
            </Dialog>
        ),
    ],
    [
        "popoverContent",
        (container?: Element | DocumentFragment | null) => (
            <Popover open>
                <PopoverContent container={container}>
                    <button data-probe="">Popover</button>
                </PopoverContent>
            </Popover>
        ),
    ],
    [
        "tooltip",
        (container?: Element | DocumentFragment | null) => (
            <Tooltip open container={container} content={<span data-probe="">Tip</span>}>
                <button>Trigger</button>
            </Tooltip>
        ),
    ],
    [
        "selectContent",
        (container?: Element | DocumentFragment | null) => (
            <Select open defaultValue="a">
                <SelectTrigger placeholder="Choose" />
                <SelectContent container={container}>
                    <SelectItem value="a" textValue="Alpha" data-probe="" />
                </SelectContent>
            </Select>
        ),
    ],
    [
        "modal",
        (container?: Element | DocumentFragment | null) => (
            <Modal open container={container} title="Test" description="Test" closeButton={false}>
                <button data-probe="">Modal</button>
            </Modal>
        ),
    ],
    [
        "drawer",
        (container?: Element | DocumentFragment | null) => (
            <Drawer open container={container} title="Test" description="Test">
                <button data-probe="">Drawer</button>
            </Drawer>
        ),
    ],
] as const;

describe.each(fixtures)("%s portal", (key, component) => {
    const settings = (container: Element | DocumentFragment | null): ComponentsProps => ({[key]: {container}});
    test("props, merged config, provider, then body; undefined inherits", async () => {
        config.components = settings(configured);
        await render(component(explicit), provider);
        expect(explicit.querySelector("[data-probe]")).not.toBeNull();
        await render(component(undefined), provider);
        expect(configured.querySelector("[data-probe]")).not.toBeNull();
        await render(component(), provider, settings(explicit));
        expect(explicit.querySelector("[data-probe]")).not.toBeNull();
        config.components = {};
        await render(component(), provider);
        expect(provider.querySelector("[data-probe]")).not.toBeNull();
        await render(component());
        expect(document.body.querySelector("[data-probe]")).not.toBeNull();
        expect(mount.querySelector("[data-probe]")).toBeNull();
    });
    test("null stops at each level without leaking to body", async () => {
        await render(component(null), provider, settings(configured));
        expect(document.body.querySelector("[data-probe]")).toBeNull();
        await render(component(), provider, settings(null));
        expect(document.body.querySelector("[data-probe]")).toBeNull();
        await render(component(), null);
        expect(document.body.querySelector("[data-probe]")).toBeNull();
    });
    test("moves to a new ShadowRoot and waits again", async () => {
        const shadow = explicit.attachShadow({mode: "open"});
        await render(component(), null);
        await render(component(), shadow);
        expect(shadow.querySelector("[data-probe]")).not.toBeNull();
        await render(component(), provider);
        expect(shadow.querySelector("[data-probe]")).toBeNull();
        expect(provider.querySelector("[data-probe]")).not.toBeNull();
        await render(component(), null);
        expect(document.body.querySelector("[data-probe]")).toBeNull();
    });
});

test("Tooltip preserves content classes when Footer adds its slot class", async () => {
    await render(
        <Footer
            leftClassName="footer-slot"
            left={
                <Tooltip
                    open
                    className="custom-tooltip"
                    contentClassName="tooltip-surface"
                    data-testid="tooltip-content"
                    content="Keyboard shortcuts"
                >
                    <button>Keyboard</button>
                </Tooltip>
            }
        />,
        provider
    );
    const content = provider.querySelector('[data-testid="tooltip-content"]')!;
    expect([...content.classList]).toEqual(
        expect.arrayContaining(["custom-tooltip", "tooltip-surface", "footer-slot"])
    );
});

test("Select retains its selected label while an initial open request waits", async () => {
    const component = fixtures[3][1];
    await render(component(), null);
    expect(mount.querySelector('[role="combobox"]')?.textContent).toBe("Alpha");
    expect(mount.querySelector('[role="combobox"]')?.getAttribute("aria-expanded")).toBe("false");
    await render(component(), provider);
    expect(mount.querySelector('[role="combobox"]')?.getAttribute("aria-expanded")).toBe("true");
    await render(component(), null);
    expect(mount.querySelector('[role="combobox"]')?.textContent).toBe("Alpha");
});

test("shadow dialog keeps tab order and its original opener across rerenders", async () => {
    const shadow = provider.attachShadow({mode: "open"});
    const opener = document.body.appendChild(document.createElement("button"));
    opener.focus();
    const dialog = (open: boolean, title: string) => (
        <Dialog open={open} title={title} description="Focus">
            <div>
                <button data-first="">First</button>
                <button data-last="">Last</button>
            </div>
        </Dialog>
    );
    await render(dialog(true, "Initial"), shadow);
    expect(shadow.activeElement).toBe(shadow.querySelector("[data-first]"));
    await render(dialog(true, "Updated"), shadow);
    await act(async () => {
        (shadow.querySelector("[data-last]") as HTMLElement).focus();
        shadow.activeElement!.dispatchEvent(
            new KeyboardEvent("keydown", {key: "Tab", bubbles: true, composed: true, cancelable: true})
        );
    });
    expect(shadow.activeElement).toBe(shadow.querySelector("[data-first]"));
    await act(async () => opener.focus());
    expect(shadow.activeElement).toBe(shadow.querySelector("[data-first]"));
    await render(dialog(false, "Closed"), shadow);
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
    });
    expect(document.activeElement).toBe(opener);
});

test("user callbacks can cancel modal autofocus and choose return focus", async () => {
    const shadow = provider.attachShadow({mode: "open"});
    const opener = document.body.appendChild(document.createElement("button"));
    const destination = document.body.appendChild(document.createElement("button"));
    opener.focus();
    const onOpenAutoFocus = jest.fn((event: Event) => event.preventDefault());
    const onCloseAutoFocus = jest.fn((event: Event) => {
        event.preventDefault();
        destination.focus();
    });
    const dialog = (open: boolean) => (
        <Dialog
            open={open}
            title="Callbacks"
            description="Callbacks"
            onOpenAutoFocus={onOpenAutoFocus}
            onCloseAutoFocus={onCloseAutoFocus}
        >
            <button>Inside</button>
        </Dialog>
    );
    await render(dialog(true), shadow);
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(opener);
    await render(dialog(false), shadow);
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
    });
    expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(destination);
});

test("Select preserves an uncontrolled open request while the provider waits", async () => {
    const select = (
        <Select defaultOpen defaultValue="a">
            <SelectTrigger placeholder="Choose" />
            <SelectContent>
                <SelectItem value="a" textValue="Alpha" />
            </SelectContent>
        </Select>
    );
    await render(select, null);
    expect(mount.querySelector('[role="combobox"]')?.textContent).toBe("Alpha");
    expect(mount.querySelector('[role="combobox"]')?.getAttribute("aria-expanded")).toBe("false");
    await render(select, provider);
    expect(mount.querySelector('[role="combobox"]')?.getAttribute("aria-expanded")).toBe("true");
});
