import React, {Fragment} from "react";
import {Meta, StoryObj} from "@storybook/react";

import {capitalizeFirstLetter, hideInTable} from "../../utils";

import TextFieldComponent from "./TextField";
import {TextFieldAccent, TextFieldRadius, TextFieldSize, TextFieldVariant} from "./types";

const variants: TextFieldVariant[] = [TextFieldVariant.Regular, TextFieldVariant.Outlined, TextFieldVariant.Filled];
const sizes: (TextFieldSize | "default")[] = [
    TextFieldSize.Small,
    "default",
    TextFieldSize.Medium,
    TextFieldSize.Large,
];
const radius: (TextFieldRadius | "default")[] = [
    TextFieldRadius.None,
    TextFieldRadius.Small,
    "default",
    TextFieldRadius.Medium,
    TextFieldRadius.Large,
    TextFieldRadius.Full,
];
const accents: (TextFieldAccent | "default")[] = ["default", TextFieldAccent.Success, TextFieldAccent.Error];

const meta: Meta<typeof TextFieldComponent> = {
    title: "Components/TextField",
    component: TextFieldComponent,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            options: variants,
            control: {type: "select"},
        },
        customSize: {
            options: sizes,
            control: {type: "select"},
        },
        radius: {
            options: radius,
            control: {type: "select"},
        },
        accent: {
            options: accents,
            control: {type: "select"},
        },
        type: {
            options: ["text", "number", "password"],
            control: {type: "select"},
        },
        label: hideInTable,
        value: hideInTable,
        defaultValue: hideInTable,
        inputClassName: hideInTable,
        afterClassName: hideInTable,
        beforeClassName: hideInTable,
    },
};

export default meta;

export const TextField: StoryObj<typeof TextFieldComponent> = {
    args: {
        placeholder: "Enter text",
        disabled: false,
        fullWidth: false,
        strict: false,
        type: "text",
        before: "🔍",
        after: "🔑",
    },
};

export const Variant = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {variants.map(variant => (
                <div key={variant}>
                    <TextFieldComponent variant={variant} placeholder={capitalizeFirstLetter(variant)} />
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
                    <TextFieldComponent
                        customSize={size !== "default" ? size : undefined}
                        placeholder={capitalizeFirstLetter(size)}
                    />
                </div>
            ))}
        </div>
    );
};

export const Accent = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {accents.map(accent => (
                <div key={accent}>
                    <TextFieldComponent
                        accent={accent !== "default" ? accent : undefined}
                        placeholder={capitalizeFirstLetter(accent)}
                    />
                </div>
            ))}
        </div>
    );
};

export const Radius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(6, auto)"}}>
            {radius.map(radius => (
                <div key={radius}>
                    <TextFieldComponent
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
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(7, auto)"}}>
            <span className="item-card__title"> Variant \ Radius</span>
            {radius.map(radius => (
                <span key={radius} className="item-card__title">
                    {capitalizeFirstLetter(radius)} radius
                </span>
            ))}
            {variants.map(variant => (
                <Fragment key={variant}>
                    <span className="item-card__title">{capitalizeFirstLetter(variant)}</span>
                    {radius.map(radius => (
                        <div key={`${radius}-${variant}`} className="item-card">
                            <TextFieldComponent
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
                            <TextFieldComponent
                                variant={variant}
                                customSize={size !== "default" ? size : undefined}
                                placeholder="Enter value"
                            />
                        </div>
                    ))}
                </Fragment>
            ))}
        </div>
    );
};
