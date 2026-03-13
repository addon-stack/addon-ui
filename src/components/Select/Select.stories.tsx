import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import {
    Select as SelectComponent,
    SelectContent,
    SelectContentProps,
    SelectItem,
    SelectItemProps,
    SelectProps,
    SelectTrigger,
    SelectTriggerProps,
} from "./index";

type Props = SelectProps &
    SelectContentProps &
    SelectTriggerProps &
    SelectItemProps & {
        firstItem?: string;
    };

const items = ["Apple", "Banana", "Blueberry", "Orange", "Strawberry"];

const meta: Meta<Props> = {
    title: "Components/Select",
    component: SelectComponent,
    tags: ["autodocs"],
    argTypes: {
        // Content
        position: {
            options: ["item-aligned", "popper"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        side: {
            options: ["top", "right", "bottom", "left"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        sideOffset: {table: {category: "Content"}},
        align: {
            options: ["start", "center", "end"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        alignOffset: {table: {category: "Content"}},
        avoidCollisions: {table: {category: "Content"}},
        collisionPadding: {table: {category: "Content"}},
        sticky: {
            options: ["partial", "always"],
            control: {type: "select"},
            table: {category: "Content"},
        },
        fullWidth: {table: {category: "Content"}},
        hideWhenDetached: {table: {category: "Content"}},
        arrowPadding: {table: {category: "Content"}},
        arrow: {table: {category: "Content"}},
        arrowWidth: {table: {category: "Content"}},
        arrowHeight: {table: {category: "Content"}},

        // Trigger
        icon: {table: {category: "Trigger"}},
        center: {table: {category: "Trigger"}},
        ellipsis: {table: {category: "Trigger"}},
        placeholder: {table: {category: "Trigger"}},

        // Item
        indicator: {table: {category: "Item"}},

        firstItem: {table: {category: "Storybook_view"}},
    },
};

export default meta;

export const Select: StoryObj<Props> = {
    args: {
        icon: "➕",
        center: false,
        ellipsis: false,
        placeholder: "Select a fruit…",

        position: "popper",
        side: "bottom",
        sideOffset: 0,
        align: "start",
        alignOffset: 0,
        avoidCollisions: true,
        collisionPadding: 10,
        arrowPadding: 0,
        fullWidth: true,
        sticky: "partial",
        hideWhenDetached: false,
        arrow: true,
        arrowWidth: 10,
        arrowHeight: 5,

        indicator: "✅",

        firstItem: "",
    },
    render: args => {
        const {indicator, firstItem, center, icon, placeholder, ...other} = args;

        const arr = firstItem ? [firstItem, ...items] : items;

        return (
            <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <SelectComponent>
                    <SelectTrigger style={{width: "200px"}} placeholder={placeholder} center={center} icon={icon} />
                    <SelectContent {...other}>
                        {arr.map(item => (
                            <SelectItem
                                key={item}
                                value={item}
                                textValue={item}
                                disabled={item === "Banana"}
                                indicator={indicator}
                            />
                        ))}
                    </SelectContent>
                </SelectComponent>
            </div>
        );
    },
};
