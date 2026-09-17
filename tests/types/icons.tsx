import React, {createRef} from "react";

import {Icon, IconMode, type IconSource} from "../../src";
import {defineConfig} from "../../src/config";

const Shape = () => <svg />;

defineConfig({icons: {
    component: Shape,
    sprite: {mode: IconMode.Sprite, component: Shape},
    inline: {mode: "inline", component: Shape},
    asset: {mode: IconMode.Asset, src: "/asset.svg"},
    literal: {mode: "sprite", component: Shape, viewBox: "0 0 40 20"},
}});

const check = (_source: IconSource) => {};
// @ts-expect-error Sprite must not accept asset fields.
check({mode: "sprite", component: Shape, src: "/asset.svg"});
// @ts-expect-error Inline must not accept asset fields.
check({mode: IconMode.Inline, component: Shape, src: "/asset.svg"});
// @ts-expect-error Asset must not accept a component.
check({mode: "asset", src: "/asset.svg", component: Shape});
// @ts-expect-error A component is required for sprite mode.
check({mode: "sprite"});
// @ts-expect-error A URL is required for asset mode.
check({mode: "asset"});
// @ts-expect-error Descriptors require an explicit mode.
check({component: Shape});
// @ts-expect-error Unknown modes are not supported.
check({mode: "auto", component: Shape});
const mixed = {mode: IconMode.Sprite, component: Shape, src: "/asset.svg"};
// @ts-expect-error Exclusion also applies to non-literal objects.
check(mixed);

const svgRef = createRef<SVGSVGElement>();
<Icon name="asset" ref={svgRef} onClick={event => event.currentTarget.getBBox()} />;
