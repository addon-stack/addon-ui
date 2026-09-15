import React, {act, type Ref} from "react";
import {createRoot, type Root} from "react-dom/client";

import Select, {type SelectProps} from "../../src/components/Select/Select";
import SelectContent from "../../src/components/Select/SelectContent";
import SelectItem from "../../src/components/Select/SelectItem";
import SelectTrigger from "../../src/components/Select/SelectTrigger";
import {UIProvider} from "../../src/providers";

let root: Root;
let mount: HTMLDivElement;
const initialWidth = window.innerWidth;
const initialHeight = window.innerHeight;

beforeEach(() => {
    mount = document.body.appendChild(document.createElement("div"));
    root = createRoot(mount);
});

afterEach(async () => {
    await act(async () => root.unmount());
    document.body.replaceChildren();
    Object.assign(window, {innerWidth: initialWidth, innerHeight: initialHeight});
});

const render = async (props: SelectProps = {}, ref?: Ref<HTMLButtonElement>) => {
    await act(async () => {
        root.render(
            <UIProvider container={false}>
                <Select defaultOpen defaultValue="a" {...props}>
                    <SelectTrigger ref={ref} />
                    <SelectContent>
                        <SelectItem value="a" textValue="Alpha" />
                        <SelectItem value="b" textValue="Beta" />
                    </SelectContent>
                </Select>
            </UIProvider>
        );
    });
};

const isOpen = () => mount.querySelector('[role="combobox"]')?.getAttribute("aria-expanded") === "true";

const resize = async (width = window.innerWidth, height = window.innerHeight) => {
    await act(async () => {
        Object.assign(window, {innerWidth: width, innerHeight: height});
        window.dispatchEvent(new Event("resize"));
    });
};

test.each(["width", "height"])("ignores unchanged resize but closes when %s changes", async dimension => {
    const onOpenChange = jest.fn();
    await render({onOpenChange});
    expect(isOpen()).toBe(true);
    await resize();
    await resize();
    expect(isOpen()).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
    await resize(initialWidth + Number(dimension === "width"), initialHeight + Number(dimension === "height"));
    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[false]]);
});

test.each(["Enter", " ", "Escape", "blur"])("unchanged resize does not swallow the next %s close", async key => {
    const onOpenChange = jest.fn();
    await render({onOpenChange});
    await resize();

    await act(async () => {
        if (key === "blur") {
            window.dispatchEvent(new Event("blur"));
        } else {
            document.querySelector('[role="option"][data-state="checked"]')!.dispatchEvent(
                new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true})
            );
        }
    });

    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[false]]);
});

test("controlled open remains authoritative and reports real resize requests", async () => {
    const onOpenChange = jest.fn();
    await render({open: true, onOpenChange});
    await resize();
    expect(onOpenChange).not.toHaveBeenCalled();
    await resize(initialWidth + 1);
    expect(isOpen()).toBe(true);
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    await render({open: false, onOpenChange});
    expect(isOpen()).toBe(false);
    await resize();
    await render({open: true, onOpenChange});

    await act(async () => window.dispatchEvent(new Event("blur")));
    expect(onOpenChange.mock.calls).toEqual([[false], [false]]);
});

test("an unconsumed resize guard expires before a later Escape", async () => {
    const onOpenChange = jest.fn();
    await render({onOpenChange});
    // Simulate a resize whose propagation ends before Radix's bubble listener.
    window.addEventListener("resize", event => event.stopImmediatePropagation(), {capture: true, once: true});
    await resize();
    expect(isOpen()).toBe(true);

    await act(async () => {
        document.querySelector('[role="option"]')!.dispatchEvent(
            new KeyboardEvent("keydown", {key: "Escape", bubbles: true, cancelable: true})
        );
    });

    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[false]]);
});

test("preserves trigger callback ref cleanup across updates and unmount", async () => {
    const cleanup = jest.fn();
    const ref = jest.fn((_element: HTMLButtonElement | null) => cleanup);
    await render({}, ref);
    const trigger = mount.querySelector('[role="combobox"]');
    expect(ref).toHaveBeenCalledWith(trigger);
    await render({open: false}, ref);
    expect(ref.mock.calls.every(([element]) => element === trigger)).toBe(true);
    expect(cleanup).toHaveBeenCalledTimes(ref.mock.calls.length - 1);
    await act(async () => root.render(null));
    expect(cleanup).toHaveBeenCalledTimes(ref.mock.calls.length);
});
