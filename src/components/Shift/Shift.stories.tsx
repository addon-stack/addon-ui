import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import ShiftComponent, {ShiftProps} from "./Shift";
import {TextField} from "../index";

type Props = ShiftProps & {
    height?: number;
};

const meta: Meta<Props> = {
    title: "Components/Shift",
    component: ShiftComponent,
    tags: ["autodocs"],
    argTypes: {
        active: {control: {type: "number"}},
        height: {control: {type: "number"}},
        adaptiveHeight: {control: {type: "boolean"}},
    },
};

export default meta;

export const Shift: StoryObj<Props> = {
    args: {
        active: 1,
        adaptiveHeight: false,
        height: undefined,
    },
    render: args => {
        return (
            <ShiftComponent {...args} style={{border: "1px solid red", width: 300}}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <h2>Title</h2>
                        <br />
                        <span>Subtitle</span>
                    </div>
                    <span>🔍</span>
                </div>
                <div>
                    <TextField after={"X"} />
                </div>
            </ShiftComponent>
        );
    },
};
