import React, {useState} from "react";
import {Meta} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import {
    Button,
    Footer,
    Header,
    IconButton,
    IconButtonSize,
    IconButtonVariant,
    ScrollArea,
    ViewportMode,
} from "../index";

import {ViewportProvider, useViewport} from "./index";

const meta: Meta<typeof ViewportProvider> = {
    title: "Components/Viewport",
    component: ViewportProvider,
    tags: ["autodocs"],
    argTypes: {
        children: hideInTable,
    },
};

export default meta;

export const Viewport = () => {
    return (
        <ViewportProvider>
            <App />
        </ViewportProvider>
    );
};

const App = () => {
    const [arr, setArr] = useState(Array.from(Array(5)));
    const {setMode, setSizes} = useViewport();

    return (
        <div
            style={{
                background: "var(--bg-secondary-color)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        >
            <Header title={"Viewport"} />
            <div style={{display: "flex", justifyContent: "space-evenly", alignItems: "center", padding: "5px 10px"}}>
                <IconButton
                    size={IconButtonSize.Medium}
                    variant={IconButtonVariant.Contained}
                    onClick={() => setArr([...arr, "item"])}
                >
                    ➕
                </IconButton>
                <Button onClick={() => setMode(ViewportMode.Expanded)}>Expand</Button>
                <Button onClick={() => setMode(ViewportMode.Adaptive)}>Collapse</Button>

                <IconButton
                    size={IconButtonSize.Medium}
                    variant={IconButtonVariant.Contained}
                    onClick={() => setArr(arr.slice(0, -1))}
                >
                    ➖
                </IconButton>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", padding: "5px 10px"}}>
                <Button onClick={() => setSizes({height: 700})}>700px height</Button>
                <Button onClick={() => setSizes({height: 700, width: 500})}>700x500px</Button>
                <Button onClick={() => setSizes({width: 500})}>500px width</Button>
            </div>
            <ScrollArea
                xOffset={2}
                type="always"
                style={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"}}
            >
                <div style={{flex: 1}}>
                    {arr.map((_, index) => (
                        <div
                            key={index}
                            style={{padding: "10px 20px", textAlign: "center", color: "var(--text-secondary-color)"}}
                        >
                            Item {++index}
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <Footer left="❤️" right="⭐" shadow style={{paddingTop: "10px"}} />
        </div>
    );
};
