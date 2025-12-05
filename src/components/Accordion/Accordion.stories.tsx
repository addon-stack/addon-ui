import React from "react";
import {Meta, StoryObj} from "@storybook/react";

import {hideInTable} from "../../utils";

import {Footer, Header, ViewportProvider} from "../index";

import {
    Accordion as AccordionComponent,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
} from "./index";

const items = [
    {title: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern."},
    {title: "Is it unstyled?", content: "Yes. It's unstyled by default, giving you freedom over the look and feel."},
    {title: "Can it be animated?", content: "Yes! You can animate the Accordion with CSS or JavaScript."},
];
const meta: Meta<typeof AccordionComponent> = {
    title: "Components/Accordion",
    component: AccordionComponent,
    tags: ["autodocs"],
    argTypes: {
        type: {
            options: ["single", "multiple"],
            control: {type: "select"},
        },
        collapsible: {
            control: {type: "boolean"},
        },

        children: hideInTable,
    },
};

export default meta;

export const Accordion: StoryObj<typeof AccordionComponent> = {
    args: {
        type: "multiple",
    },

    render: args => {
        const {...other} = args;
        return (
            <ViewportProvider
                style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    minWidth: "320px",
                    maxWidth: "320px",
                }}
            >
                <Header title="Accordion Component" style={{paddingBottom: "10px"}} />
                <AccordionComponent style={{marginBottom: "auto", overflow: "hidden"}} {...other}>
                    {items.map(({title, content}) => (
                        <AccordionItem key={title} value={title}>
                            <AccordionHeader style={{justifyContent: "space-between"}}>
                                <AccordionTrigger>
                                    <div
                                        style={{
                                            width: "100%",
                                            padding: "5px 10px",
                                            background: "var(--bg-primary-color)",
                                        }}
                                    >
                                        <span>{title}</span>
                                    </div>
                                </AccordionTrigger>
                            </AccordionHeader>
                            <AccordionContent>
                                <div
                                    style={{
                                        background: "var(--bg-secondary-color)",
                                        padding: "10px",
                                    }}
                                >
                                    {content}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </AccordionComponent>
                <Footer left={"❤️"} right={"⭐"} shadow={true} style={{paddingTop: "10px"}} />
            </ViewportProvider>
        );
    },
};
