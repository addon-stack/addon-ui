import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import {IconButton, IconButtonSize, IconButtonVariant} from "../index";

import FooterComponent from "./Footer";

const meta: Meta<typeof FooterComponent> = {
    title: "Components/Footer",
    component: FooterComponent,
    tags: ["autodocs"],
    argTypes: {
        left: hideInTable,
        right: hideInTable,
        style: hideInTable,
        children: hideInTable,
        className: hideInTable,
        leftClassName: hideInTable,
        rightClassName: hideInTable,
        childrenClassName: hideInTable,
    },
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--bg-secondary-color",
                    width: "380px",
                    height: "300px",
                    borderRadius: "10px",
                }}
            >
                <span style={{flexGrow: 1}} />
                <Story />
            </div>
        ),
    ],
};

export default meta;

export const Footer: StoryObj<typeof FooterComponent> = {
    args: {
        shadow: true,
        reverse: false,
        style: {paddingTop: "20px"},
        children: (
            <div>
                <div style={{display: "flex", gap: "20px"}}>
                    <IconButton style={{fontSize: "20px"}} tooltip={{content: "Change theme"}}>
                        🌓
                    </IconButton>
                    <IconButton style={{fontSize: "20px"}} tooltip={{content: "Rate Us"}}>
                        ❤️
                    </IconButton>
                </div>
                <div style={{display: "flex", gap: "20px"}}>
                    <IconButton style={{fontSize: "20px"}} tooltip={{content: "Support Us"}}>
                        💲
                    </IconButton>
                    <IconButton style={{fontSize: "20px"}} tooltip={{content: "FAQ"}}>
                        ❓
                    </IconButton>
                </div>
            </div>
        ),
    },
};

export const FooterWithoutChildren: StoryObj<typeof FooterComponent> = {
    args: {
        shadow: true,
        reverse: false,
        style: {paddingTop: "20px"},
        left: (
            <div>
                <IconButton
                    variant={IconButtonVariant.Contained}
                    size={IconButtonSize.Medium}
                    style={{fontSize: "20px"}}
                    tooltip={{content: "Change theme"}}
                >
                    🌓
                </IconButton>
                <IconButton
                    variant={IconButtonVariant.Contained}
                    size={IconButtonSize.Medium}
                    style={{fontSize: "20px"}}
                    tooltip={{content: "Rate Us"}}
                >
                    ❤️
                </IconButton>
            </div>
        ),
        right: (
            <div>
                <IconButton
                    variant={IconButtonVariant.Ghost}
                    size={IconButtonSize.Medium}
                    style={{fontSize: "20px"}}
                    tooltip={{content: "Support Us"}}
                >
                    💲
                </IconButton>
                <IconButton
                    variant={IconButtonVariant.Ghost}
                    size={IconButtonSize.Medium}
                    style={{fontSize: "20px"}}
                    tooltip={{content: "FAQ"}}
                >
                    ❓
                </IconButton>
            </div>
        ),
    },
};
