import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import {Button} from "../index";
import {ToggleGroup as ToggleGroupComponent, ToggleGroupItem, ToggleGroupIndicator, ToggleGroupProps} from "./index";

type Props = ToggleGroupProps;

const meta: Meta<Props> = {
    title: "Components/ToggleGroup",
    component: ToggleGroupComponent,
    tags: ["autodocs"],
    argTypes: {
        type: {
            options: ["single", "multiple"],
            control: {type: "select"},
        },
        orientation: {
            options: ["horizontal", "vertical", undefined],
            control: {type: "select"},
        },
        dir: {
            options: ["ltr", "rtl", undefined],
            control: {type: "select"},
        },
    },
};

export default meta;

export const ToggleGroup: StoryObj<Props> = {
    args: {
        type: "single",
        orientation: undefined,
        dir: undefined,
        disabled: false,
        rovingFocus: true,
        loop: true,
    },

    render: (props: Props) => {
        return (
            <ToggleGroupComponent {...props}>
                {[1, 2, 3, 4].map(item => (
                    <ToggleGroupItem value={String(item)} key={item}>
                        <Button>
                            {`Option ${item}`}
                            <ToggleGroupIndicator>✅</ToggleGroupIndicator>
                        </Button>
                    </ToggleGroupItem>
                ))}
            </ToggleGroupComponent>
        );
    },
};
