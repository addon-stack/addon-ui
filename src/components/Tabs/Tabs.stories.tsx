import React, {PropsWithChildren} from "react";
import {Meta, StoryObj} from "@storybook/react";

import {Header} from "../Header";
import {Footer} from "../Footer";
import {ViewportProvider} from "../Viewport";

import TabsComponent, {TabsProps} from "./Tabs";
import TabsList, {TabsListProps} from "./TabsList";
import TabsTrigger, {TabsTriggerProps} from "./TabsTrigger";
import TabsContent from "./TabsContent";

type Props = TabsProps & TabsListProps & TabsTriggerProps;

const triggers = ["Current", "Active", "History"];

const meta: Meta<Props> = {
    title: "Components/Tabs",
    component: TabsComponent,
    tags: ["autodocs"],
    argTypes: {
        reverse: {
            control: {type: "boolean"},
            description: "Reverse list with content",
            table: {
                category: "Tabs",
            },
        },

        separator: {
            control: {type: "boolean"},
            description: "Show separator in TabsList",
            table: {
                category: "Tabs List",
            },
        },

        indicator: {
            control: {type: "boolean"},
            description: "Show indicator in TabsList",
            table: {
                category: "Tabs List",
            },
        },

        loop: {
            control: {type: "boolean"},
            description: "When true, keyboard navigation will loop from last tab to first, and vice versa.",
            table: {
                category: "Tabs List",
            },
        },

        roundedEdges: {
            control: {type: "boolean"},
            description: "When true, prevents the user from interacting with the tab.",
            table: {
                category: "Tabs List",
            },
        },

        disabled: {
            control: {type: "boolean"},
            description: "When true, prevents the user from interacting with the tab.",
            table: {
                category: "Tabs Trigger",
            },
        },
    },
};

export default meta;

export const Tabs: StoryObj<Props> = {
    args: {
        defaultValue: "Current",
        separator: true,
        indicator: true,
        loop: true,
        disabled: false,
        roundedEdges: false,
    },

    render: args => {
        const {defaultValue, separator, indicator, loop, roundedEdges, reverse} = args;
        return (
            <ViewportProvider style={{border: "1px solid black", borderRadius: "10px"}}>
                <Header title="Tabs Component" style={{paddingBottom: "10px"}} />
                <TabsComponent reverse={reverse} defaultValue={defaultValue} style={{flex: 1}}>
                    <TabsList separator={separator} indicator={indicator} loop={loop} roundedEdges={roundedEdges}>
                        {triggers.map(trigger => (
                            <TabsTrigger value={trigger} disabled={args.disabled}>
                                {trigger}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {triggers.map(trigger => (
                        <TabsContent value={trigger}>
                            <ContentWrapper>{`${trigger} tab`}</ContentWrapper>
                        </TabsContent>
                    ))}
                </TabsComponent>
                <Footer left={"❤️"} right={"⭐"} shadow={true} style={{paddingTop: "10px"}} />
            </ViewportProvider>
        );
    },
};

const ContentWrapper = ({children}: PropsWithChildren) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}
        >
            {children}
        </div>
    );
};
