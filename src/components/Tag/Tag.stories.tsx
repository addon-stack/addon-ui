import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {capitalizeFirstLetter} from "../../utils";

import TagComponent from "./Tag";
import {TagColor, TagRadius, TagSize, TagVariant} from "./types";

const variants: TagVariant[] = [TagVariant.Contained, TagVariant.Outlined, TagVariant.Soft];
const colors: (TagColor | "default")[] = ["default", TagColor.Primary, TagColor.Secondary, TagColor.Accent];
const sizes: (TagSize | "default")[] = [TagSize.Small, "default", TagSize.Medium, TagSize.Large];
const radius: (TagRadius | "default")[] = [TagRadius.Small, TagRadius.Medium, TagRadius.Large, "default"];

const meta: Meta<typeof TagComponent> = {
    title: "Components/Tag",
    component: TagComponent,
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
    },
};

export default meta;

export const Tag: StoryObj<typeof TagComponent> = {
    args: {
        children: "Test",
        variant: TagVariant.Contained,
        color: TagColor.Primary,
        clickable: false,
    },
};

export const Variant = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <TagComponent variant={variant} color={TagColor.Primary}>
                        {capitalizeFirstLetter(variant)}
                    </TagComponent>
                </div>
            ))}
        </div>
    );
};

export const VariantDisabled = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <TagComponent variant={variant} color={TagColor.Primary}>
                        {capitalizeFirstLetter(variant)}
                    </TagComponent>
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
                    <TagComponent size={size !== "default" ? size : undefined} color={TagColor.Primary}>
                        {capitalizeFirstLetter(size)}
                    </TagComponent>
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
                    <TagComponent radius={radius !== "default" ? radius : undefined} color={TagColor.Primary}>
                        {capitalizeFirstLetter(radius)}
                    </TagComponent>
                </div>
            ))}
        </div>
    );
};

export const VariantColor = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {variants.map(variant =>
                colors.map(color => (
                    <div key={`${variant}-${color}`}>
                        <TagComponent variant={variant} color={color !== "default" ? color : undefined}>
                            {capitalizeFirstLetter(color)}
                        </TagComponent>
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
                        <TagComponent
                            variant={variant}
                            size={size !== "default" ? size : undefined}
                            color={TagColor.Primary}
                        >
                            {capitalizeFirstLetter(size)}
                        </TagComponent>
                    </div>
                ))
            )}
        </div>
    );
};

export const VariantRadius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {variants.map(variant =>
                radius.map(radius => (
                    <div key={`${variant}-${radius}`}>
                        <TagComponent
                            variant={variant}
                            radius={radius !== "default" ? radius : undefined}
                            color={TagColor.Primary}
                        >
                            {capitalizeFirstLetter(radius)}
                        </TagComponent>
                    </div>
                ))
            )}
        </div>
    );
};
