import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import {Button} from "../index";

import TooltipComponent from "./Tooltip";

const meta: Meta<typeof TooltipComponent> = {
    title: "Components/Tooltip",
    component: TooltipComponent,
    tags: ["autodocs"],
    argTypes: {
        open: {
            options: [true, false, undefined],
            control: "select",
            type: "boolean",
            description: "The controlled open state of the tooltip. Must be used in conjunction with onOpenChange.",
        },
        side: {
            options: ["top", "right", "bottom", "left"],
            control: "select",
            description:
                "The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.",
        },
        align: {
            options: ["start", "center", "end"],
            control: "select",
            description: "The preferred alignment against the trigger. May change when collisions occur.",
        },
        delayDuration: {
            description:
                "Override the duration given to the `Provider` to customise the open delay for a specific tooltip.",
        },
        arrowWidth: {
            description: "The width of the arrow in pixels.",
        },
        arrowHeight: {
            description: "The height of the arrow in pixels.",
        },
        arrowPadding: {
            description:
                "The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners.",
        },
        alignOffset: {
            description: 'An offset in pixels from the "start" or "end" alignment options.',
        },
        avoidCollisions: {
            description:
                "When true, overrides the side and align preferences to prevent collisions with boundary edges.",
        },
        matchTriggerWidth: {
            description: "Whether to set the content width equal to the trigger width",
        },

        arrowClassName: hideInTable,
        contentClassName: hideInTable,
        children: hideInTable,
    },
};

export default meta;

export const Tooltip: StoryObj<typeof TooltipComponent> = {
    args: {
        content: "Tooltip content",
        open: undefined,
        align: "center",
        alignOffset: 0,
        side: "top",
        sideOffset: 0,
        arrowHeight: 5,
        arrowWidth: 10,
        arrowPadding: 0,
        delayDuration: 700,
        matchTriggerWidth: false,
        avoidCollisions: true,
        children: <Button style={{marginTop: "40px"}}>Button</Button>,
    },
};

export const Sides = () => {
    const props = {
        content: "Tooltip content",
        open: true,
        align: "center" as const,
        alignOffset: 0,
        sideOffset: 0,
        arrowHeight: 7,
        arrowWidth: 12,
        arrowPadding: 0,
        delayDuration: 700,
        matchTriggerWidth: false,
        avoidCollisions: true,
        children: <Button>Button</Button>,
    };

    return (
        <div style={{height: "200px", display: "flex", flexDirection: "column", gap: "20px"}}>
            <TooltipComponent {...props} side="top" />
            <div>
                <TooltipComponent {...props} side="left" />
                <TooltipComponent {...props} side="right" />
            </div>
            <TooltipComponent {...props} side="bottom" />
        </div>
    );
};
