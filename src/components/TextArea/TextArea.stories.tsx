import React, {Fragment} from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {capitalizeFirstLetter, hideInTable} from "../../utils";

import TextAreaComponent from "./TextArea";
import {TextAreaRadius, TextAreaSize, TextAreaVariant} from "./types";

const variants: TextAreaVariant[] = [TextAreaVariant.Regular, TextAreaVariant.Outlined, TextAreaVariant.Filled];
const sizes: (TextAreaSize | "default")[] = [TextAreaSize.Small, "default", TextAreaSize.Medium, TextAreaSize.Large];
const radius: (TextAreaRadius | "default")[] = [
    TextAreaRadius.None,
    TextAreaRadius.Small,
    "default",
    TextAreaRadius.Medium,
    TextAreaRadius.Large,
];

const meta: Meta<typeof TextAreaComponent> = {
    title: "Components/TextArea",
    component: TextAreaComponent,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            options: variants,
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

        label: hideInTable,
        children: hideInTable,
    },
};

export default meta;

export const TextArea: StoryObj<typeof TextAreaComponent> = {
    args: {
        placeholder: "Enter text",
        disabled: false,
        fullWidth: false,
    },
};

export const Variant = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {variants.map(variant => (
                <div key={variant}>
                    <TextAreaComponent variant={variant} placeholder={capitalizeFirstLetter(variant)} />
                </div>
            ))}
        </div>
    );
};

export const Size = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {sizes.map(size => (
                <div key={size}>
                    <TextAreaComponent
                        size={size !== "default" ? size : undefined}
                        placeholder={capitalizeFirstLetter(size)}
                    />
                </div>
            ))}
        </div>
    );
};

export const Radius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {radius.map(radius => (
                <div key={radius}>
                    <TextAreaComponent
                        radius={radius !== "default" ? radius : undefined}
                        placeholder={capitalizeFirstLetter(radius)}
                    />
                </div>
            ))}
        </div>
    );
};

export const VariantRadius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(5, auto)"}}>
            <span className="item-card__title"> Variant \ Radius</span>
            {radius.slice(1).map(radius => (
                <span key={radius} className="item-card__title">
                    {capitalizeFirstLetter(radius)} radius
                </span>
            ))}
            {variants.map(variant => (
                <Fragment key={variant}>
                    <span className="item-card__title">{capitalizeFirstLetter(variant)}</span>
                    {radius.slice(1).map(radius => (
                        <div key={`${radius}-${variant}`} className="item-card">
                            <TextAreaComponent
                                variant={variant}
                                radius={radius !== "default" ? radius : undefined}
                                placeholder="Enter value"
                            />
                        </div>
                    ))}
                </Fragment>
            ))}
        </div>
    );
};

export const VariantSize = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(5, auto)"}}>
            <span className="item-card__title"> Variant \ Size</span>
            {sizes.map(size => (
                <span key={size} className="item-card__title">
                    {capitalizeFirstLetter(size)} size
                </span>
            ))}
            {variants.map(variant => (
                <Fragment key={variant}>
                    <span className="item-card__title">{capitalizeFirstLetter(variant)}</span>
                    {sizes.map(size => (
                        <div key={`${size}-${variant}`} className="item-card">
                            <TextAreaComponent
                                variant={variant}
                                size={size !== "default" ? size : undefined}
                                placeholder="Enter value"
                            />
                        </div>
                    ))}
                </Fragment>
            ))}
        </div>
    );
};
