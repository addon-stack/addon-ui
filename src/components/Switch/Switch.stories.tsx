import {Meta, StoryObj} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import SwitchComponent from "./Switch";

const meta: Meta<typeof SwitchComponent> = {
    title: "Components/Switch",
    component: SwitchComponent,
    tags: ["autodocs"],
    argTypes: {
        children: hideInTable,
        className: hideInTable,
        thumbClassName: hideInTable,
    },
};

export default meta;

export const Switch: StoryObj<typeof SwitchComponent> = {
    args: {
        checked: true,
        disabled: false,
    },
};
