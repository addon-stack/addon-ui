import React, {useState} from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {capitalizeFirstLetter, hideInTable} from "../../utils";

import CheckboxComponent, {CheckedState} from "./Checkbox";
import {CheckboxRadius, CheckboxSize, CheckboxVariant} from "./types";

const variants: (CheckboxVariant | "default")[] = ["default", CheckboxVariant.Classic, CheckboxVariant.Soft];
const size: (CheckboxSize | "default")[] = [CheckboxSize.Small, "default", CheckboxSize.Medium, CheckboxSize.Large];
const radius: (CheckboxRadius | "default")[] = [CheckboxRadius.Small, "default", CheckboxRadius.Large];

const meta: Meta<typeof CheckboxComponent> = {
    title: "Components/Checkbox",
    component: CheckboxComponent,
    tags: ["autodocs"],
    argTypes: {
        checked: {
            options: [true, false, "indeterminate"],
            control: {type: "select"},
        },
        variant: {
            options: variants,
            control: {type: "select"},
        },
        size: {
            options: size,
            control: {type: "select"},
        },
        radius: {
            options: radius,
            control: {type: "select"},
        },

        checkedIcon: hideInTable,
        indeterminateIcon: hideInTable,
        children: hideInTable,
        className: hideInTable,
        indicatorClassName: hideInTable,
    },
};

export default meta;

export const Checkbox: StoryObj<typeof CheckboxComponent> = {
    args: {
        checked: true,
        disabled: false,
        variant: CheckboxVariant.Classic,
    },
};

export const CheckboxClickable = () => {
    const [checked, setChecked] = useState<CheckedState>("indeterminate");

    return <CheckboxComponent variant={CheckboxVariant.Classic} checked={checked} onCheckedChange={setChecked} />;
};

export const Variant = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {variants.map(variant => (
                <span key={variant} className="item-card__title">
                    {capitalizeFirstLetter(variant)}
                </span>
            ))}

            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <CheckboxComponent variant={variant !== "default" ? variant : undefined} checked={false} />
                </div>
            ))}

            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <CheckboxComponent variant={variant !== "default" ? variant : undefined} checked={true} />
                </div>
            ))}

            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <CheckboxComponent variant={variant !== "default" ? variant : undefined} checked="indeterminate" />
                </div>
            ))}
        </div>
    );
};

export const VariantDisabled = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {variants.map(variant => (
                <span key={variant} className="item-card__title">
                    {capitalizeFirstLetter(variant)}
                </span>
            ))}

            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <CheckboxComponent disabled variant={variant !== "default" ? variant : undefined} checked={false} />
                </div>
            ))}

            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <CheckboxComponent disabled variant={variant !== "default" ? variant : undefined} checked={true} />
                </div>
            ))}

            {variants.map(variant => (
                <div key={variant} className="item-card">
                    <CheckboxComponent
                        disabled
                        variant={variant !== "default" ? variant : undefined}
                        checked="indeterminate"
                    />
                </div>
            ))}
        </div>
    );
};

export const Size = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(4, auto)"}}>
            {size.map(size => (
                <span key={size} className="item-card__title">
                    {capitalizeFirstLetter(size)}
                </span>
            ))}

            {size.map(size => (
                <div key={size} className="item-card">
                    <CheckboxComponent size={size !== "default" ? size : undefined} checked={false} />
                </div>
            ))}

            {size.map(size => (
                <div key={size} className="item-card">
                    <CheckboxComponent size={size !== "default" ? size : undefined} checked={true} />
                </div>
            ))}

            {size.map(size => (
                <div key={size} className="item-card">
                    <CheckboxComponent size={size !== "default" ? size : undefined} checked="indeterminate" />
                </div>
            ))}
        </div>
    );
};

export const Radius = () => {
    return (
        <div className="grid-wrapper" style={{gridTemplateColumns: "repeat(3, auto)"}}>
            {radius.map(radius => (
                <span key={radius} className="item-card__title">
                    {capitalizeFirstLetter(radius)}
                </span>
            ))}

            {radius.map(radius => (
                <div key={radius} className="item-card">
                    <CheckboxComponent radius={radius !== "default" ? radius : undefined} checked={false} />
                </div>
            ))}

            {radius.map(radius => (
                <div key={radius} className="item-card">
                    <CheckboxComponent radius={radius !== "default" ? radius : undefined} checked={true} />
                </div>
            ))}

            {radius.map(radius => (
                <div key={radius} className="item-card">
                    <CheckboxComponent radius={radius !== "default" ? radius : undefined} checked="indeterminate" />
                </div>
            ))}
        </div>
    );
};
