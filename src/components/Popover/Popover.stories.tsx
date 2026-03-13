import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import {
    Popover as PopoverComponent,
    PopoverAnchor,
    PopoverContent,
    PopoverContentProps,
    PopoverProps,
    PopoverTrigger,
    PopoverTriggerProps,
} from "./index";

import {TextArea, TextField} from "../index";

type Props = PopoverProps &
    PopoverContentProps &
    PopoverTriggerProps & {
        withAnchor: boolean;
        triggerWidth: number;
    };

const meta: Meta<Props> = {
    title: "Components/Popover",
    component: PopoverComponent,
    tags: ["autodocs"],
    argTypes: {
        // Root
        modal: {table: {category: "Root"}},

        // Trigger
        center: {table: {category: "Trigger"}},

        // Content
        side: {
            options: ["top", "right", "bottom", "left"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        align: {
            options: ["start", "center", "end"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        sticky: {
            options: ["partial", "always"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        alignOffset: {table: {category: "Content"}},
        sideOffset: {table: {category: "Content"}},
        minWidth: {table: {category: "Content"}, control: {type: "number"}},
        maxWidth: {table: {category: "Content"}, control: {type: "number"}},
        fullWidth: {table: {category: "Content"}},
        overlay: {table: {category: "Content"}},
        avoidCollisions: {table: {category: "Content"}},
        collisionPadding: {table: {category: "Content"}},
        hideWhenDetached: {table: {category: "Content"}},
        arrow: {table: {category: "Content"}},
        arrowWidth: {table: {category: "Content"}},
        arrowHeight: {table: {category: "Content"}},

        // Storybook view
        withAnchor: {table: {category: "Storybook_view"}},
        triggerWidth: {table: {category: "Storybook_view"}, control: {type: "number"}},
    },
};

export default meta;

export const Popover: StoryObj<Props> = {
    args: {
        modal: false,

        center: false,

        side: "bottom",
        sideOffset: 10,
        align: "center",
        alignOffset: 0,
        minWidth: undefined,
        maxWidth: undefined,
        fullWidth: false,
        overlay: true,
        avoidCollisions: true,
        collisionPadding: 0,
        sticky: "partial",
        hideWhenDetached: false,
        arrow: true,
        arrowWidth: 10,
        arrowHeight: 5,

        withAnchor: false,
        triggerWidth: undefined,
    },
    render: args => {
        const {modal, center, withAnchor, triggerWidth, ...other} = args;

        return (
            <PopoverComponent modal={modal}>
                <PopoverTrigger center={center} style={{width: triggerWidth}}>
                    <span>Open Popover</span>
                    {withAnchor && <PopoverAnchor>➕</PopoverAnchor>}
                </PopoverTrigger>

                <PopoverContent {...other}>
                    <div style={{display: "flex", flexDirection: "column", gap: 15}}>
                        {["Name", "Surname", "Age"].map(item => (
                            <div key={item} style={{display: "flex", alignItems: "center", gap: 5}}>
                                <label style={{fontSize: "16px", fontWeight: 600, flex: 1}} htmlFor={item}>
                                    {item}
                                </label>
                                <div style={{flex: 1}}>
                                    <TextField
                                        id={item}
                                        type={item === "Age" ? "number" : "text"}
                                        placeholder={`Enter ${item}`}
                                    />
                                </div>
                            </div>
                        ))}
                        <TextArea placeholder="Enter your message" />
                    </div>
                </PopoverContent>
            </PopoverComponent>
        );
    },
};
