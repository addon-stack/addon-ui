import React, {useState} from "react";

import type {Meta} from "storybook-react-rsbuild";

import {HideInTable} from "../../utils";
import {Button, DrawerSide} from "../index";

import ViewDrawerComponent, {type ViewDrawerProps} from "./ViewDrawer";

const sides: DrawerSide[] = [DrawerSide.Left, DrawerSide.Top, DrawerSide.Bottom, DrawerSide.Right];

const meta: Meta<typeof ViewDrawerComponent> = {
    title: "Components/ViewDrawer",
    component: ViewDrawerComponent,
    tags: ["autodocs"],
    argTypes: {
        side: {
            options: sides,
            control: {type: "select"},
        },
        title: {
            type: "string",
        },
        subtitle: {
            type: "string",
        },
        after: {
            type: "string",
        },
        before: {
            type: "string",
        },
        fullscreen: {
            type: "boolean",
        },
        speed: {
            type: "number",
        },
        children: HideInTable,
        className: HideInTable,
        wrapClassName: HideInTable,
        titleClassName: HideInTable,
        bodyClassName: HideInTable,
        headerClassName: HideInTable,
        beforeClassName: HideInTable,
        afterClassName: HideInTable,
        subtitleClassName: HideInTable,
        childrenClassName: HideInTable,
    },
};

export default meta;

export const ViewDrawer = (props: ViewDrawerProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)}>Open</Button>
            <ViewDrawerComponent
                open={open}
                onOpenChange={setOpen}
                title="Volume Up Plus"
                side={DrawerSide.Right}
                fullscreen={false}
                subtitle="Adjust the current tab's volume with the slider. Switch to any audio tab in one click."
                after="❤️"
                {...props}
            >
                <Button style={{margin: "50px auto", maxWidth: "max-content"}} onClick={() => setOpen(false)}>
                    Close ViewDrawer
                </Button>
            </ViewDrawerComponent>
        </div>
    );
};
