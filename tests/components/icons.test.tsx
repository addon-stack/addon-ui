import React, {act, type ComponentProps, createRef, memo, useState} from "react";
import {createRoot, type Root} from "react-dom/client";

import {Icon, IconMode, type IconProps, type Icons} from "../../src/components/Icon";
import {UIProvider, useIcons} from "../../src/providers";
import config from "../../src/virtual/config";

let root: Root;
let mount: HTMLDivElement;

const Shape = (props: ComponentProps<"svg">) => (
    <svg viewBox="0 0 80 20" {...props}><path d="M0 0h80v20H0z" /></svg>
);

beforeEach(() => {
    mount = document.body.appendChild(document.createElement("div"));
    root = createRoot(mount);
});

afterEach(async () => {
    await act(async () => root.unmount());
    config.icons = {};
    document.body.replaceChildren();
});

const render = async (icons: Icons, props: Partial<IconProps> = {}) => {
    await act(async () => root.render(
        <UIProvider container={false} icons={icons}>
            <Icon name="sample" data-testid="icon" {...props} />
        </UIProvider>
    ));
};

test("component shorthand retains original props and shares one registered symbol", async () => {
    const component = jest.fn((_props: ComponentProps<"svg">) => <path d="M0 0h24v24H0z" />);
    const icons = {sample: component};

    await act(async () => root.render(
        <UIProvider container={false} icons={icons}>
            <Icon name="sample" /><Icon name="sample" />
        </UIProvider>
    ));

    const id = mount.querySelector('symbol[data-icon="sample"]')!.id;

    expect([...mount.querySelectorAll("use")].map(element => element.getAttribute("href")))
        .toEqual([`#${id}`, `#${id}`]);

    expect(mount.querySelectorAll("symbol")).toHaveLength(1);
    expect(mount.querySelector("svg")?.hasAttribute("viewBox")).toBe(false);
    expect(component.mock.calls[0][0]).toEqual({});
    expect(mount.querySelector("symbol")?.getAttribute("viewBox")).toBe("0 0 24 24");
});

test("supports memo components in component shorthand", async () => {
    await render({sample: memo(Shape)});
    expect(mount.querySelector("symbol svg path")).not.toBeNull();
});

test("a sprite descriptor without viewBox preserves the component's coordinate system", async () => {
    await render({sample: Shape});
    const original = mount.querySelector("symbol svg")?.getAttribute("viewBox");
    await render({sample: {mode: "sprite", component: Shape}});
    expect(mount.querySelector("symbol svg")?.getAttribute("viewBox")).toBe(original);
    expect(original).toBe("0 0 80 20");
});

test("sprite metadata supplies the symbol and viewport while instance dimensions stay independent", async () => {
    await render({sample: {mode: IconMode.Sprite, component: Shape, viewBox: "0 0 80 20"}}, {width: 160, height: 40});
    const svg = mount.querySelector('[data-testid="icon"]')!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 80 20");
    expect(svg.getAttribute("width")).toBe("160");
    expect(svg.getAttribute("height")).toBe("40");
    expect(mount.querySelector("symbol")?.getAttribute("viewBox")).toBe("0 0 80 20");
    expect(mount.querySelector("symbol svg")?.getAttribute("width")).toBe("100%");
    await render({sample: {mode: "sprite", component: Shape, viewBox: "0 0 80 20"}}, {viewBox: "0 0 40 20"});
    expect(mount.querySelector('[data-testid="icon"]')?.getAttribute("viewBox")).toBe("0 0 40 20");
    expect(mount.querySelector("symbol")?.getAttribute("viewBox")).toBe("0 0 80 20");
});

function StatefulIcon(props: ComponentProps<"svg">) {
    const [count, setCount] = useState(0);

    return (
        <svg {...props} onClick={() => setCount(value => value + 1)} data-count={count}>
            <path d="M0 0h10v10H0z" />
        </svg>
    );
}

test("inline icons have independent state, retain the source viewBox and never register symbols", async () => {
    const icons: Icons = {sample: {mode: "inline", component: StatefulIcon}, shape: {mode: "inline", component: Shape}};

    await act(async () => root.render(
        <UIProvider container={false} icons={icons}>
            <Icon name="sample" /><Icon name="sample" /><Icon name="shape" />
        </UIProvider>
    ));

    const instances = mount.querySelectorAll("[data-count]");
    await act(async () => instances[0].dispatchEvent(new MouseEvent("click", {bubbles: true})));
    expect([...instances].map(element => element.getAttribute("data-count"))).toEqual(["1", "0"]);
    expect(mount.querySelector('svg[viewBox="0 0 80 20"]')).not.toBeNull();
    expect(mount.querySelectorAll("symbol, use")).toHaveLength(0);
});

test.each([IconMode.Sprite, IconMode.Inline, IconMode.Asset])("%s preserves SVG props and refs", async mode => {
    const ref = createRef<SVGSVGElement>();
    const onClick = jest.fn();

    const icons: Icons = {sample: mode === IconMode.Asset
        ? {mode, src: "/icon.svg"}
        : {mode, component: Shape}};

    await act(async () => root.render(
        <UIProvider container={false} icons={icons}>
            <Icon
                name="sample" ref={ref} size={32} className="custom"
                style={{color: "red"}} aria-label="Sample" onClick={onClick}
            />
        </UIProvider>
    ));

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current?.classList.contains("custom")).toBe(true);
    expect(ref.current?.getAttribute("width")).toBe("32");
    expect(ref.current?.getAttribute("aria-label")).toBe("Sample");
    expect(ref.current?.style.color).toBe("red");
    await act(async () => ref.current!.dispatchEvent(new MouseEvent("click", {bubbles: true})));
    expect(onClick).toHaveBeenCalledTimes(1);

    if (mode === IconMode.Asset) {
        expect(ref.current?.querySelector("image")?.getAttribute("href")).toBe("/icon.svg");
        expect(mount.querySelector("symbol")).toBeNull();
    }
});

test("switches between all modes and updates the registered symbol when a source changes", async () => {
    await render({sample: Shape});
    expect(mount.querySelector("symbol")).not.toBeNull();
    await render({sample: {mode: "asset", src: "/new.svg"}});
    expect(mount.querySelector("symbol, use")).toBeNull();
    expect(mount.querySelector("image")?.getAttribute("href")).toBe("/new.svg");
    await render({sample: {mode: "inline", component: Shape}});
    expect(mount.querySelector("symbol, use, image")).toBeNull();
    await render({sample: {mode: "sprite", component: () => <circle r="3" />, viewBox: "0 0 10 10"}});
    expect(mount.querySelector("symbol circle")).not.toBeNull();
    expect(mount.querySelector("symbol path")).toBeNull();
    await render({sample: {mode: "sprite", component: Shape}});
    expect(mount.querySelector("symbol path")).not.toBeNull();
});

let resolved: Icons;

function ReadIcons() {
    resolved = useIcons().icons;

    return null;
}

test("provider replaces entire entries from config and preserves unrelated names and source identity", async () => {
    config.icons = {sample: {mode: "sprite", component: Shape, viewBox: "0 0 80 20"}, retained: Shape};
    const source = {mode: IconMode.Asset, src: "/override.svg"} as const;
    const icons = {sample: source};
    await act(async () => root.render(<UIProvider container={false} icons={icons}><ReadIcons /></UIProvider>));
    expect(resolved.sample).toBe(source);
    expect(resolved.sample).toEqual({mode: "asset", src: "/override.svg"});
    expect(resolved.retained).toBe(Shape);
    expect(config.icons.sample).toHaveProperty("component", Shape);
});

test("missing icon keeps caller fallback styling and can be registered later", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    try {
        await render({}, {style: {width: 41, color: "red"}});
        expect(mount.querySelector("span")?.style.width).toBe("41px");
        await render({sample: Shape});
        expect(mount.querySelector("span")).toBeNull();
        expect(mount.querySelector("symbol")).not.toBeNull();
    } finally {
        warn.mockRestore();
    }
});
