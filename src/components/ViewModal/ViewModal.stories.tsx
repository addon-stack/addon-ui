import React, {useState} from "react";

import type {Meta} from "storybook-react-rsbuild";

import {HideInTable} from "../../utils";
import {Button} from "../index";

import ViewModalComponent, {type ViewModalProps} from "./ViewModal";

const meta: Meta<typeof ViewModalComponent> = {
    title: "Components/ViewModal",
    component: ViewModalComponent,
    tags: ["autodocs"],
    argTypes: {
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

export const ViewModal = (props: ViewModalProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)}>Open</Button>
            <ViewModalComponent
                open={open}
                onOpenChange={setOpen}
                title="Volume Up Plus"
                fullscreen={false}
                subtitle="Adjust the current tab's volume with the slider. Switch to any audio tab in one click."
                after="❤️"
                {...props}
            >
                <Button style={{margin: "50px auto", maxWidth: "max-content"}} onClick={() => setOpen(false)}>
                    Close ViewModal
                </Button>
            </ViewModalComponent>
        </div>
    );
};
