import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import {capitalizeFirstLetter, hideInTable} from "../../utils";

import ButtonComponent from "./Button";
import {ButtonColor, ButtonRadius, ButtonSize, ButtonVariant} from "./types";

const variants: ButtonVariant[] = [ButtonVariant.Contained, ButtonVariant.Outlined, ButtonVariant.Text];
const colors: (ButtonColor | "default")[] = [
    "default",
    ButtonColor.Primary,
    ButtonColor.Secondary,
    ButtonColor.Accent,
    ButtonColor.Error,
    ButtonColor.Success,
];
const sizes: (ButtonSize | "default")[] = [ButtonSize.Small, "default", ButtonSize.Medium, ButtonSize.Large];
const radius: (ButtonRadius | "default")[] = [
    ButtonRadius.Small,
    "default",
    ButtonRadius.Medium,
    ButtonRadius.Large,
    ButtonRadius.Full,
];

const meta: Meta<typeof ButtonComponent> = {
    title: "Components/Button",
    component: ButtonComponent,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            options: variants,
            control: {type: "select"},
        },
        color: {
            options: colors,
            control: {type: "select"},
        },
        size: {
            options: sizes,
            control: {type: "select"},
        },
        radius: {
            options: radius,
            control: {type: "select"},
        },

        after: hideInTable,
        before: hideInTable,
        afterClassName: hideInTable,
        beforeClassName: hideInTable,
        childrenClassName: hideInTable,
    },
};

export default meta;

export const Button: StoryObj<typeof ButtonComponent> = {
    args: {
        children: "Button",
    },
};

export const VariantColor = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(6, auto)"}}>
            {variants.map(variant =>
                colors.map(color => (
                    <div key={`${variant}-${color}`}>
                        <ButtonComponent variant={variant} color={color !== "default" ? color : undefined}>
                            {capitalizeFirstLetter(color)}
                        </ButtonComponent>
                    </div>
                ))
            )}
        </div>
    );
};

export const VariantColorDisabled = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(6, auto)"}}>
            {variants.map(variant =>
                colors.map(color => (
                    <div key={`${variant}-${color}`}>
                        <ButtonComponent disabled variant={variant} color={color !== "default" ? color : undefined}>
                            {capitalizeFirstLetter(color)}
                        </ButtonComponent>
                    </div>
                ))
            )}
        </div>
    );
};

export const VariantSize = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {variants.map(variant =>
                sizes.map(size => (
                    <div key={`${variant}-${size}`}>
                        <ButtonComponent variant={variant} size={size !== "default" ? size : undefined}>
                            {capitalizeFirstLetter(size)}
                        </ButtonComponent>
                    </div>
                ))
            )}
        </div>
    );
};

export const VariantRadius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(5, auto)"}}>
            {variants.map(variant =>
                radius.map(radius => (
                    <div key={`${variant}-${radius}`}>
                        <ButtonComponent variant={variant} radius={radius !== "default" ? radius : undefined}>
                            {capitalizeFirstLetter(radius)}
                        </ButtonComponent>
                    </div>
                ))
            )}
        </div>
    );
};

export const SizeRadius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(5, auto)"}}>
            <span className="item-card__title"> Radius \ Size </span>
            {sizes.map(size => (
                <span key={size} className="item-card__title">
                    {capitalizeFirstLetter(size)} size
                </span>
            ))}
            {radius.map(radius => (
                <>
                    <span key={radius} className="item-card__title">
                        {capitalizeFirstLetter(radius)} radius
                    </span>
                    {sizes.map(size => (
                        <div key={`${size}-${radius}`} className="item-card">
                            <ButtonComponent
                                size={size !== "default" ? size : undefined}
                                radius={radius !== "default" ? radius : undefined}
                            >
                                Button
                            </ButtonComponent>
                        </div>
                    ))}
                </>
            ))}
        </div>
    );
};
