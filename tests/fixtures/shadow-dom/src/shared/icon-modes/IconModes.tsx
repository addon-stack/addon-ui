import React, {useState} from "react";
import {createPortal} from "react-dom";

import {Icon, type IconMap, IconMode, UIProvider} from "addon-ui";

import IconIds from "./IconIds";

import Asset from "./asset.svg";
import PaintServers from "./paint-servers.svg?react";
import Wide from "./wide.svg?react";
import WithDimensions from "./with-dimensions.svg?react";
import styles from "./icon-modes.module.scss";

const Sources: IconMap = {
    "mode-sprite": {mode: IconMode.Sprite, component: Wide, viewBox: "0 0 80 20"},
    "mode-inline": {mode: "inline", component: Wide},
    "mode-asset": {mode: IconMode.Asset, src: Asset},
};

const GeometrySources: IconMap = {
    "wide-component": Wide,
    "wide-descriptor": {mode: "sprite", component: Wide},
    "fixed-component": WithDimensions,
    "fixed-descriptor": {mode: "sprite", component: WithDimensions},
    "fixed-inline": {mode: "inline", component: WithDimensions},
    "fixed-sprite-explicit": {mode: "sprite", component: WithDimensions, viewBox: "0 0 80 20"},
    "fixed-inline-explicit": {mode: "inline", component: WithDimensions, viewBox: "0 0 80 20"},
    "paint-servers": {mode: "sprite", component: PaintServers, viewBox: "0 0 120 40"},
};

export default function IconModes() {
    const [mode, setMode] = useState(0);
    const [portal, setPortal] = useState<HTMLDivElement | null>(null);
    const source = [Sources["mode-sprite"], Sources["mode-inline"], Sources["mode-asset"]][mode];

    return (
        <UIProvider container={false} icons={{...Sources, ...GeometrySources, "mode-switch": source}}>
            <section data-testid="icon-modes" className={styles.modes}>
                {Object.keys(Sources).map(name => (
                    <Icon key={name} name={name} width={80} height={20} data-testid={name} className={styles.icon} />
                ))}
                <Icon
                    name="mode-inline" width={80} height={20}
                    data-testid="mode-inline-second" className={styles.second}
                />
                <Icon name="mode-switch" width={80} height={20} data-testid="mode-switch" />
                <button data-testid="icon-mode-next" onClick={() => setMode(value => (value + 1) % 3)}>
                    Next mode
                </button>
                <div ref={setPortal} data-testid="icon-portal" />
                {portal && createPortal(
                    <Icon name="mode-sprite" width={80} height={20} data-testid="mode-portal" />, portal
                )}
                <div className={styles.geometry}>
                    {Object.keys(GeometrySources).filter(name => name !== "paint-servers").map(name => (
                        <Icon key={name} name={name} size={40} height={10} data-testid={name} />
                    ))}
                    <Icon name="paint-servers" width={120} height={40} data-testid="paint-servers" />
                </div>
                <IconIds />
            </section>
        </UIProvider>
    );
}
