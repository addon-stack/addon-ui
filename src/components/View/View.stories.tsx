import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import ViewComponent from "./View";

const meta: Meta<typeof ViewComponent> = {
    title: "Components/View",
    component: ViewComponent,
    tags: ["autodocs"],
    argTypes: {
        before: hideInTable,
        after: hideInTable,
        className: hideInTable,
        wrapClassName: hideInTable,
        titleClassName: hideInTable,
        bodyClassName: hideInTable,
        headerClassName: hideInTable,
        beforeClassName: hideInTable,
        afterClassName: hideInTable,
        subtitleClassName: hideInTable,
        childrenClassName: hideInTable,
    },
    decorators: [
        Story => (
            <div
                style={{background: "var(--bg-secondary-color", width: "380px", height: "400px", borderRadius: "10px"}}
            >
                <Story />
            </div>
        ),
    ],
};

export default meta;

export const View: StoryObj<typeof ViewComponent> = {
    args: {
        title: "Volume Up Plus",
        subtitle: "Adjust the current tab's volume with the slider. Switch to any audio tab in one click.",
        before: "❤️",
        alignCenter: true,
        center: true,
        showSeparate: true,
        children: "children",
    },
};
