import React from "react";

import {Meta, StoryObj} from "@storybook/react";

import TruncateComponent, {TruncateProps} from "./Truncate";

const meta: Meta<TruncateProps> = {
    title: "Components/Truncate",
    component: TruncateComponent,
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

export const Truncate: StoryObj<TruncateProps> = {
    args: {
        text: "https://www.figma.com/design/T7txseZ8nSmsnjglF5vTye/node-id=7719-343&p=f&t=6Tl4gAOTDaPxfsHE-0",
        middle: false,
        separator: "...",
    },

    render: props => {
        return (
            <div
                style={{
                    resize: "horizontal",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    padding: "15px 10px",
                    minWidth: "0px",
                    maxWidth: "800px",
                }}
            >
                <TruncateComponent {...props} />
            </div>
        );
    },
};
