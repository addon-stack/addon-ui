import React, {useState} from "react";
import {createPortal} from "react-dom";

import {Icon, type IconMap, UIProvider} from "addon-ui";

import Circle from "./circle.svg?react";
import Square from "./square.svg?react";

const Names = ["shared", "shared space", "shared_20_space", "50%#😀"];
const OuterIcons: IconMap = Object.fromEntries(Names.map(name => [name, Square]));
const InnerIcons: IconMap = {shared: Circle};

export default function IconIds() {
    const [portal, setPortal] = useState<HTMLDivElement | null>(null);

    return (
        <section data-testid="icon-ids" style={{background: "white", width: "100%"}}>
            <div id="shared">Application element with the same name</div>
            <UIProvider container={false} icons={OuterIcons}>
                {Names.map((name, index) => (
                    <Icon name={name} key={name} data-icon-id-case={`outer-${index}`} />
                ))}
                <UIProvider container={false} icons={InnerIcons}>
                    <Icon name="shared" data-icon-id-case="inner" />
                    <div ref={setPortal} />
                </UIProvider>
                {portal && createPortal(<Icon name="shared" data-icon-id-case="portal" />, portal)}
            </UIProvider>
            <UIProvider container={false} icons={InnerIcons}>
                <Icon name="shared" data-icon-id-case="sibling" />
            </UIProvider>
        </section>
    );
}
