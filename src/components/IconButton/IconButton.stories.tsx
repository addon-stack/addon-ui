import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {capitalizeFirstLetter, hideInTable} from "../../utils";

import IconButtonComponent from "./IconButton";
import {IconButtonRadius, IconButtonSize, IconButtonVariant} from "./types";

const variants: (IconButtonVariant | "default")[] = [
    "default",
    IconButtonVariant.Contained,
    IconButtonVariant.Outlined,
    IconButtonVariant.Ghost,
];
const sizes: (IconButtonSize | "default")[] = [
    IconButtonSize.Small,
    "default",
    IconButtonSize.Medium,
    IconButtonSize.Large,
];
const radius: (IconButtonRadius | "default")[] = [
    IconButtonRadius.Small,
    IconButtonRadius.Medium,
    IconButtonRadius.Large,
    "default",
];

const meta: Meta<typeof IconButtonComponent> = {
    title: "Components/IconButton",
    component: IconButtonComponent,
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

        after: hideInTable,
        before: hideInTable,
        children: hideInTable,
        afterClassName: hideInTable,
        beforeClassName: hideInTable,
        childrenClassName: hideInTable,
    },
};

export default meta;

const icon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12.0002 2L15.1037 8.72839L22.4618 9.60081L17.0218 14.6316L18.4658 21.8992L12.0002 18.28L5.53456 21.8992L6.97862 14.6316L1.53857 9.60081L8.89669 8.72839L12.0002 2Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
        />
    </svg>
);

export const IconButton: StoryObj<typeof IconButtonComponent> = {
    args: {
        children: icon,
        disabled: false,
        tooltip: {
            content: "Rate Us",
        },
    },
};

export const Variant = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(5, auto)"}}>
            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <span className="item-card__title">{capitalizeFirstLetter(variant)}</span>
                    <IconButtonComponent variant={variant !== "default" ? variant : undefined}>
                        {icon}
                    </IconButtonComponent>
                </div>
            ))}
        </div>
    );
};

export const VariantDisabled = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(5, auto)"}}>
            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <span className="item-card__title">{capitalizeFirstLetter(variant)}</span>
                    <IconButtonComponent disabled variant={variant !== "default" ? variant : undefined}>
                        {icon}
                    </IconButtonComponent>
                </div>
            ))}
        </div>
    );
};

export const Size = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {sizes.map(size => (
                <div key={size} className="item-card">
                    <span className="item-card__title">{capitalizeFirstLetter(size)}</span>
                    <IconButtonComponent
                        size={size !== "default" ? size : undefined}
                        variant={IconButtonVariant.Contained}
                    >
                        {icon}
                    </IconButtonComponent>
                </div>
            ))}
        </div>
    );
};

export const Radius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {radius.map(radius => (
                <div key={radius} className="item-card">
                    <span className="item-card__title">{capitalizeFirstLetter(radius)}</span>
                    <IconButtonComponent
                        radius={radius !== "default" ? radius : undefined}
                        variant={IconButtonVariant.Contained}
                    >
                        {icon}
                    </IconButtonComponent>
                </div>
            ))}
        </div>
    );
};

export const VariantSize = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {variants.map(variant =>
                sizes.map(size => (
                    <div key={`${variant}-${size}`}>
                        <IconButtonComponent
                            variant={variant !== "default" ? variant : undefined}
                            size={size !== "default" ? size : undefined}
                        >
                            {icon}
                        </IconButtonComponent>
                    </div>
                ))
            )}
        </div>
    );
};

export const SizeRadius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {sizes.map(size =>
                radius.map(radius => (
                    <div key={`${radius}-${size}`} className="item-card">
                        <IconButtonComponent
                            variant={IconButtonVariant.Contained}
                            radius={radius !== "default" ? radius : undefined}
                            size={size !== "default" ? size : undefined}
                        >
                            {icon}
                        </IconButtonComponent>
                    </div>
                ))
            )}
        </div>
    );
};
