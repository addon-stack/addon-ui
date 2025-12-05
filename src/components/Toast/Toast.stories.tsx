import React, {FC, useState} from "react";
import {Meta, StoryObj} from "@storybook/react";

import {hideInTable} from "../../utils";

import {Button, ButtonColor, ButtonVariant} from "../index";

import ToastComponent, {ToastProps} from "./Toast";
import {ToastColor, ToastRadius, ToastSide, ToastAnimation} from "./types";

const sides: ToastSide[] = [
    ToastSide.TopLeft,
    ToastSide.TopCenter,
    ToastSide.TopRight,
    ToastSide.BottomRight,
    ToastSide.BottomCenter,
    ToastSide.BottomLeft,
];
const colors: (ToastColor | "default")[] = ["default", ToastColor.Success, ToastColor.Error];
const radius: (ToastRadius | "default")[] = [
    ToastRadius.None,
    ToastRadius.Small,
    "default",
    ToastRadius.Medium,
    ToastRadius.Large,
];

const animations = [ToastAnimation.Slide, ToastAnimation.Opacity];

const meta: Meta<typeof ToastComponent> = {
    title: "Components/Toast",
    component: ToastComponent,
    tags: ["autodocs"],
    argTypes: {
        duration: {
            description: "The time in milliseconds that should elapse before automatically closing each toast.",
        },
        swipeDirection: {
            options: ["right", "left", "up", "down"],
            control: {type: "select"},
            description: "The direction of the pointer swipe that should close the toast.",
        },
        swipeThreshold: {
            description: "The distance in pixels that the swipe gesture must travel before a close is triggered.",
            control: {type: "number"},
        },
        side: {
            options: sides,
            control: {type: "select"},
        },
        radius: {
            options: radius,
            control: {type: "select"},
        },
        color: {
            options: colors,
            control: {type: "select"},
        },
        animationIn: {
            options: animations,
            control: {type: "select"},
        },
        animationOut: {
            options: animations,
            control: {type: "select"},
        },

        action: hideInTable,
        closeIcon: hideInTable,
        closeProps: hideInTable,
        onClose: hideInTable,
        children: hideInTable,
        className: hideInTable,
        titleClassName: hideInTable,
        actionClassName: hideInTable,
        viewportClassName: hideInTable,
        descriptionClassName: hideInTable,
    },
};

export default meta;

export const Toast: StoryObj<typeof ToastComponent> = {
    args: {
        open: true,
        sticky: false,
        fullWidth: false,
        children: (
            <Button variant={ButtonVariant.Contained} color={ButtonColor.Primary}>
                Show toast
            </Button>
        ),
        title: "New notification",
        description: "Description",
        side: ToastSide.BottomRight,
        duration: 5000,
        onClose: () => undefined,
    },
};

const ToastClickable: FC<ToastProps> = ({children, ...props}) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => setOpen(prev => !prev);
    const handleClose = () => setOpen(false);

    return (
        <ToastComponent
            open={open}
            title="New notification"
            description="Description"
            onOpenChange={setOpen}
            onClose={handleClose}
            {...props}
        >
            <Button variant={ButtonVariant.Contained} color={ButtonColor.Primary} onClick={handleClick}>
                {children}
            </Button>
        </ToastComponent>
    );
};

export const Side = () => {
    return (
        <div style={{display: "grid", gridTemplateColumns: "repeat(6, auto)", gap: "10px"}}>
            <ToastClickable side={ToastSide.TopLeft} description="Top Left">
                Top Left
            </ToastClickable>

            <ToastClickable side={ToastSide.TopCenter} description="Top Center">
                Top Center
            </ToastClickable>

            <ToastClickable side={ToastSide.TopRight} description="Top Right">
                Top Right
            </ToastClickable>

            <ToastClickable side={ToastSide.BottomLeft} description="Bottom Left">
                Bottom Left
            </ToastClickable>

            <ToastClickable side={ToastSide.BottomCenter} description="Bottom Center">
                Bottom Center
            </ToastClickable>

            <ToastClickable side={ToastSide.BottomRight} description="Bottom Right">
                Bottom Right
            </ToastClickable>
        </div>
    );
};

export const Radius = () => {
    return (
        <div style={{display: "flex", gap: "10px"}}>
            <ToastClickable side={ToastSide.TopLeft} radius={ToastRadius.None} description="None Radius">
                None
            </ToastClickable>

            <ToastClickable side={ToastSide.TopCenter} radius={ToastRadius.Small} description="Small Radius">
                Small
            </ToastClickable>

            <ToastClickable side={ToastSide.TopRight} description="Default Radius">
                Default
            </ToastClickable>

            <ToastClickable side={ToastSide.BottomLeft} radius={ToastRadius.Medium} description="Medium Radius">
                Medium
            </ToastClickable>

            <ToastClickable side={ToastSide.BottomRight} radius={ToastRadius.Large} description="Large Radius">
                Large
            </ToastClickable>
        </div>
    );
};

export const FullWidth = () => {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <ToastClickable
                side={ToastSide.TopCenter}
                radius={ToastRadius.None}
                fullWidth
                sticky
                description="Top full width without padding"
            >
                Top
            </ToastClickable>

            <ToastClickable
                side={ToastSide.BottomCenter}
                radius={ToastRadius.None}
                fullWidth
                sticky
                description="Bottom full width without padding"
            >
                Bottom
            </ToastClickable>
        </div>
    );
};

export const Color = () => {
    return (
        <div style={{display: "flex", gap: "10px"}}>
            <ToastClickable side={ToastSide.TopLeft} color={ToastColor.Error} description="Error color">
                Error
            </ToastClickable>

            <ToastClickable side={ToastSide.TopCenter} description="Default color">
                Default
            </ToastClickable>

            <ToastClickable side={ToastSide.TopRight} color={ToastColor.Success} description="Success color">
                Success
            </ToastClickable>
        </div>
    );
};
