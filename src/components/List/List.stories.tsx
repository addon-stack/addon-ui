import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import {ListItem, Button, ButtonSize, ButtonVariant, Avatar, AvatarSize} from "../index";

import ListComponent from "./List";

const mockListItems = [
    {
        id: 1,
        avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
        name: "John Doe",
        role: "React Developer",
        action: "Add",
    },
    {
        id: 2,
        avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
        name: "Emily Smith",
        role: "UI/UX Designer",
        action: "Invite",
    },
    {
        id: 3,
        avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
        name: "Michael Johnson",
        role: "Project Manager",
        action: "Add",
    },
    {
        id: 4,
        avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
        name: "Sarah Brown",
        role: "QA Engineer",
        action: "Invite",
    },
    {
        id: 5,
        avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
        name: "David Wilson",
        role: "DevOps Engineer",
        action: "Invite",
    },
];

const meta: Meta<typeof ListComponent> = {
    title: "Components/List",
    component: ListComponent,
    tags: ["autodocs"],
    argTypes: {
        children: hideInTable,
        className: hideInTable,
        style: hideInTable,
    },
};

export default meta;

type Story = StoryObj<typeof ListComponent>;

export const List: Story = {
    args: {
        children: mockListItems.map(({id, avatar, name, role, action}) => (
            <ListItem
                key={id}
                left={<Avatar src={avatar} size={AvatarSize.Small} />}
                primary={<span style={{fontWeight: 500}}>{name}</span>}
                secondary={<span style={{fontSize: "14px"}}>{role}</span>}
                right={
                    <Button variant={ButtonVariant.Contained} size={ButtonSize.Small}>
                        {action}
                    </Button>
                }
            />
        )),
        style: {
            minWidth: "300px",
        },
    },
};
