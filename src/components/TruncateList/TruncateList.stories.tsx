import React from "react";

import {Meta, StoryObj} from "@storybook/react";

import TruncateListComponent, {TruncateListProps} from "./TruncateList";
import {Tag, TagColor, TagVariant} from "../Tag";

const meta: Meta<TruncateListProps> = {
    title: "Components/TruncateList",
    component: TruncateListComponent,
    tags: ["autodocs"],
    argTypes: {
        flushImmediately: {
            control: {type: 'boolean'},
            description: 'test'
        },
    },
};

export default meta;

export const TruncateList: StoryObj<TruncateListProps> = {
    args: {
        maxRows: 1,
        maxVisibleItems: 10,
        flushImmediately: true
    },

    render: ({...props}) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <span>items + renderItem</span>
                <div
                    style={{
                        resize: 'horizontal',
                        overflow: 'auto',
                        border: '1px solid #ccc',
                        padding: '15px 10px',
                        minWidth: '100px',
                        maxWidth: '500px',
                    }}
                >
                    <TruncateListComponent
                        items={["One", "Two", "Three", "Four", "Five"]}
                        renderItem={(item, index) => <Tag key={index}>{item}</Tag>}
                        {...props}
                    />
                </div>
                <br/>
                <span>children</span>
                <div
                    style={{
                        resize: 'horizontal',
                        overflow: 'auto',
                        border: '1px solid #ccc',
                        padding: '15px 10px',
                        minWidth: '100px',
                        maxWidth: '500px',
                    }}
                >
                    <TruncateListComponent
                        {...props}
                    >
                        <Tag variant={TagVariant.Outlined}>One</Tag>
                        <Tag color={TagColor.Accent}>Two</Tag>
                        <Tag variant={TagVariant.Soft}>Three</Tag>
                        <Tag color={TagColor.Primary}>Four</Tag>
                        <Tag color={TagColor.Secondary}>Five</Tag>
                    </TruncateListComponent>
                </div>
            </div>
        );

    }
};

