import React from "react";

import type {Meta, StoryObj} from "storybook-react-rsbuild";

import {HideInTable} from "../../utils";

import HeaderComponent from "./Header";

const meta: Meta<typeof HeaderComponent> = {
    title: "Components/Header",
    component: HeaderComponent,
    tags: ["autodocs"],
    argTypes: {
        before: HideInTable,
        after: HideInTable,
        children: HideInTable,
        className: HideInTable,
        wrapClassName: HideInTable,
        titleClassName: HideInTable,
        beforeClassName: HideInTable,
        afterClassName: HideInTable,
        subtitleClassName: HideInTable,
        childrenClassName: HideInTable,
    },
    decorators: [
        Story => (
            <div
                style={{background: "var(--bg-secondary-color", width: "380px", height: "300px", borderRadius: "10px"}}
            >
                <Story />
            </div>
        ),
    ],
};

export default meta;

export const Header: StoryObj<typeof HeaderComponent> = {
    args: {
        title: "Volume Up Plus",
        subtitle: "Adjust the current tab's volume with the slider. Switch to any audio tab in one click.",
    },
};

export const WithLogo: StoryObj<typeof HeaderComponent> = {
    args: {
        title: "Volume Up Plus",
        subtitle: "Adjust the current tab's volume with the slider. Switch to any audio tab in one click.",
        before: "❤️",
    },
};
