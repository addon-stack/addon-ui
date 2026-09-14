import {Meta, StoryObj} from "storybook-react-rsbuild";

import {HideInTable} from "../../utils";

import SwitchComponent from "./Switch";

const meta: Meta<typeof SwitchComponent> = {
    title: "Components/Switch",
    component: SwitchComponent,
    tags: ["autodocs"],
    argTypes: {
        children: HideInTable,
        className: HideInTable,
        thumbClassName: HideInTable,
    },
};

export default meta;

export const Switch: StoryObj<typeof SwitchComponent> = {
    args: {
        checked: true,
        disabled: false,
    },
};
