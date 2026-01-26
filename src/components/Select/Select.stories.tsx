import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import {Header} from "../Header";
import {Footer} from "../Footer";
import {ViewportProvider} from "../Viewport";

import SelectComponent, {SelectProps} from "./Select";
import SelectItem from "./SelectItem";
import SelectTrigger, {SelectTriggerProps} from "./SelectTrigger";
import SelectContent, {SelectContentProps} from "./SelectContent";

type Props = SelectProps & SelectContentProps & SelectTriggerProps;

const items = ["Apple", "Banana", "Blueberry", "Orange", "Strawberry"];

const meta: Meta<Props> = {
    title: "Components/Select",
    component: SelectComponent,
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

export const Select: StoryObj<Props> = {
    render: () => {
        return (
            <ViewportProvider style={{border: "1px solid black", borderRadius: "10px"}}>
                <Header title="Select Component" style={{paddingBottom: "10px"}} />
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <SelectComponent>
                        <SelectTrigger style={{width: "200px"}} placeholder="Select a fruit…" icon={"➕"} />
                        <SelectContent
                            position="popper"
                            // side='top'
                            sideOffset={9}
                            // alignOffset={20}
                            arrowPadding={80}
                            // align="center"
                            fullWidth={true}
                            // arrow={true}
                            // arrowHeight={15}
                            // arrowWidth={25}
                        >
                            {items.map(item => (
                                <SelectItem
                                    key={item}
                                    value={item}
                                    textValue={item}
                                    disabled={item === "Banana"}
                                    // indicator={"❤️"}
                                ></SelectItem>
                            ))}
                        </SelectContent>
                    </SelectComponent>
                </div>
                <Footer left={"❤️"} right={"⭐"} shadow={true} style={{paddingTop: "10px"}} />
            </ViewportProvider>
        );
    },
};
