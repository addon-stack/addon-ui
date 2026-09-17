import React, {act, type ComponentProps, memo, Profiler, useState} from "react";
import {createRoot, type Root} from "react-dom/client";

import {Icon, type IconMap} from "../../src/components/Icon";
import {SvgSprite} from "../../src/components/SvgSprite";
import {IconsProvider, UIProvider, useIcons, useTheme} from "../../src/providers";
// Test the private ID helpers without exposing them through the provider API.
// eslint-disable-next-line project/module-boundaries
import {createSymbolPrefix, getSymbolId} from "../../src/providers/icons/symbol-id";
import config from "../../src/virtual/config";

let root: Root;
let mount: HTMLDivElement;

beforeEach(() => {
    mount = document.body.appendChild(document.createElement("div"));
    root = createRoot(mount);
});

afterEach(async () => {
    await act(async () => root.unmount());
    config.icons = {};
    document.body.replaceChildren();
});

const Shape = (_props: ComponentProps<"svg">) => <path d="M0 0h24v24H0z" />;
const OtherShape = (_props: ComponentProps<"svg">) => <circle cx="12" cy="12" r="12" />;

let register: (name: string) => void;
let registered: string[];

function ReadRegistry() {
    const contract = useIcons();
    register = contract.registerIcon;
    registered = contract.registeredIconNames;

    return null;
}

test("registering B leaves the A list and existing symbol untouched while public useIcons updates", async () => {
    const source = jest.fn(Shape);
    const onRender = jest.fn();
    const icons = {a: source, b: OtherShape};

    await act(async () => root.render(
        <IconsProvider icons={icons}>
            <Profiler id="a-list" onRender={onRender}><Icon name="a" /><Icon name="a" /></Profiler>
            <ReadRegistry />
        </IconsProvider>
    ));

    onRender.mockClear();
    source.mockClear();
    await act(async () => register("b"));
    expect(registered).toEqual(["a", "b"]);
    expect(onRender).not.toHaveBeenCalled();
    expect(source).not.toHaveBeenCalled();
    const names = registered;
    await act(async () => register("b"));
    expect(registered).toBe(names);
    expect(mount.querySelectorAll("symbol")).toHaveLength(2);
});

test("mounting B and rerendering UIProvider with omitted config props keeps A memoized", async () => {
    const source = jest.fn(Shape);
    const onRender = jest.fn();
    config.icons = {a: source, b: OtherShape};

    const List = memo(function List() {
        return <Profiler id="a-list" onRender={onRender}><Icon name="a" /><Icon name="a" /></Profiler>;
    });

    let update: () => void;

    function App() {
        const [count, setCount] = useState(0);
        update = () => setCount(value => value + 1);

        return (
            <UIProvider container={false}>
                <List />
                {count > 0 && <Icon name="b" />}
                <span>{count}</span>
            </UIProvider>
        );
    }

    await act(async () => root.render(<App />));
    onRender.mockClear();
    source.mockClear();
    await act(async () => update());
    await act(async () => update());
    expect(onRender).not.toHaveBeenCalled();
    expect(source).not.toHaveBeenCalled();
    expect(mount.querySelectorAll("symbol")).toHaveLength(2);
});

test("icon replacements, component defaults and theme changes still reach memoized consumers", async () => {
    let theme: string;
    let toggle: () => void;

    const ReadTheme = memo(function ReadTheme() {
        const contract = useTheme();
        theme = contract.theme;
        toggle = contract.toggleTheme;

        return null;
    });

    const render = async (icons: IconMap, size: number) => act(async () => root.render(
        <UIProvider container={false} icons={icons} components={{icon: {size}}}>
            <Icon name="a" /><ReadTheme />
        </UIProvider>
    ));

    await render({a: Shape}, 24);
    const id = mount.querySelector("symbol")!.id;
    await render({a: OtherShape}, 32);
    expect(mount.querySelector("symbol")!.id).toBe(id);
    expect(mount.querySelector("symbol circle")).not.toBeNull();
    expect(mount.querySelector("symbol path")).toBeNull();
    expect(mount.querySelector("svg")!.getAttribute("width")).toBe("32");
    const previousTheme = theme!;
    await act(async () => toggle());
    expect(theme!).not.toBe(previousTheme);
});

test("provider prefixes isolate same-name symbols from the document, sibling and nested providers", async () => {
    await act(async () => root.render(
        <>
            <div id="a" />
            <IconsProvider icons={{a: Shape}}>
                <Icon name="a" />
                <IconsProvider icons={{a: OtherShape}}><Icon name="a" /></IconsProvider>
            </IconsProvider>
            <IconsProvider icons={{a: Shape}}><Icon name="a" /></IconsProvider>
        </>
    ));

    const symbols = [...mount.querySelectorAll("symbol")];
    const ids = symbols.map(element => element.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids.every(id => /^addon-ui-[a-f0-9]{32}-a$/.test(id))).toBe(true);
    const uses = [...mount.querySelectorAll("use")];

    expect(uses.map(use => document.getElementById(use.getAttribute("href")!.slice(1))?.tagName))
        .toEqual(["symbol", "symbol", "symbol"]);

    expect(document.getElementById(uses[1].getAttribute("href")!.slice(1))?.querySelector("circle")).not.toBeNull();
});

test("symbol names encode Unicode code points and escape-like literals without collisions", () => {
    const names = ["", "a", "a-b", "a b", "a_20_b", "a%b", "a#b", "_", "😀", "е", "é", "é", "\ud800"];
    const ids = names.map(name => getSymbolId("test", name));
    expect(new Set(ids).size).toBe(names.length);
    expect(ids.every(id => /^[A-Za-z0-9_-]+$/.test(id))).toBe(true);
    expect(getSymbolId("test", "😀")).toBe("test-_1f600_");
    expect(getSymbolId("test", "_20_")).toBe("test-_5f_20_5f_");
    expect(getSymbolId("test", "%20")).toBe("test-_25_20");
    expect(createSymbolPrefix()).not.toBe(createSymbolPrefix());
});

test("standalone sprites retain raw IDs and accept an explicit resolver", async () => {
    await act(async () => root.render(<SvgSprite icons={{a: Shape}} />));
    expect(mount.querySelector("symbol")!.id).toBe("a");
    await act(async () => root.render(<SvgSprite icons={{a: Shape}} getSymbolId={name => `custom-${name}`} />));
    expect(mount.querySelector("symbol")!.id).toBe("custom-a");
    expect(mount.querySelector("symbol")!.getAttribute("data-icon")).toBe("a");
});
