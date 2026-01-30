import React, {useState} from "react";

import {Meta, StoryObj} from "@storybook/react";

import TruncateComponent, {TruncateProps} from "./Truncate";
import {Header, Highlight, ScrollArea, TextField, ViewportProvider} from "../index";

const list = [
    {
        title: "Travel Guide to Italy",
        url: "https://www.lonelyplanet.com/travel/italy-guide",
    },
    {
        title: "Travel Tips for First-Time Travelers",
        url: "https://www.nationalgeographic.com/travel/travelers/tips-for-beginners",
    },
    {
        title: "Best Travel Destinations in Europe",
        url: "https://www.bbc.com/travel/article/best-destinations-europe",
    },
    {
        title: "Healthy Travel: Eating Well on the Road",
        url: "https://www.healthline.com/health/travel-eating-tips",
    },
    {
        title: "Home Workout for Beginners",
        url: "https://www.healthline.com/fitness/home-workout-beginners",
    },
    {
        title: "Workout Routine for Home Training",
        url: "https://www.menshealth.com/fitness/home-workout-routine",
    },
    {
        title: "Beginner Guide to Investing",
        url: "https://www.investopedia.com/investing/beginner-guide",
    },
    {
        title: "Investment Strategies for Beginners",
        url: "https://www.forbes.com/investing/investment-strategies-beginners",
    },
    {
        title: "Coffee Brewing Guide for Beginners",
        url: "https://www.thespruceeats.com/coffee-brewing-guide",
    },
    {
        title: "Best Coffee Beans for Home Brewing",
        url: "https://www.seriouseats.com/coffee-beans-home-brewing",
    },
];

const meta: Meta<TruncateProps> = {
    title: "Components/Truncate",
    component: TruncateComponent,
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

export const Truncate: StoryObj<TruncateProps> = {
    args: {
        text: "https://www.figma.com/design/T7txseZ8nSmsnjglF5vTye/node-id=7719-343&p=f&t=6Tl4gAOTDaPxfsHE-0",
        middle: false,
        separator: "...",
    },

    render: props => <TruncateStoryRender {...props} />,
};

export const Inline: StoryObj<TruncateProps> = {
    args: {
        text: "Very long text that should be truncated to fit in line with a button",
        middle: true,
    },

    render: props => (
        <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <Header title="Inline Truncate with Button (flex-start)" />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "300px",
                    resize: "horizontal",
                    overflow: "auto",
                }}
            >
                <TruncateComponent {...props} style={{flexShrink: 1}} />
                <button style={{flexShrink: 0, marginLeft: "10px"}}>Button</button>
            </div>

            <Header title="Inline Truncate with Button (always follows)" />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "400px",
                    resize: "horizontal",
                    overflow: "auto",
                }}
            >
                <TruncateComponent {...props} style={{flexShrink: 1}} />
                <button style={{flexShrink: 0, marginLeft: "10px"}}>Action</button>
            </div>
        </div>
    ),
};

const TruncateStoryRender = (props: TruncateProps) => {
    const [searchWords, setSearchWords] = useState("");

    const filteredItems = list.filter(({title, url}) => {
        const value = searchWords.toLowerCase();
        return title.toLowerCase().includes(value) || url.toLowerCase().includes(value);
    });

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "20px", alignItems: "center"}}>
            <div
                style={{
                    resize: "horizontal",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    padding: "15px 10px",
                    minWidth: "0px",
                    width: "400px",
                    maxWidth: "800px",
                }}
            >
                <TruncateComponent {...props} />
            </div>

            <ViewportProvider
                style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    minWidth: "300px",
                    width: "400px",
                    maxWidth: "800px",
                    maxHeight: "300px",
                    resize: "horizontal",
                }}
            >
                <Header title="Truncate with highlight" style={{paddingBottom: "10px"}} />

                <div style={{margin: "0 20px 10px"}}>
                    <TextField value={searchWords} onChange={e => setSearchWords(e.target.value)} />
                </div>

                <ScrollArea style={{borderTop: "1px solid #ccc"}}>
                    {filteredItems.map(({title, url}) => (
                        <div key={url} style={{borderBottom: "1px solid #ccc", padding: "10px"}}>
                            <TruncateComponent
                                text={title}
                                render={text => <Highlight textToHighlight={text} searchWords={[searchWords]} />}
                            />
                            <div style={{display: "flex", alignItems: "center", minWidth: 0}}>
                                <TruncateComponent
                                    text={url}
                                    render={text => <Highlight textToHighlight={text} searchWords={[searchWords]} />}
                                    middle
                                    style={{flexShrink: 1}}
                                />
                                <button style={{flexShrink: 0, marginLeft: "8px"}}>Button</button>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </ViewportProvider>
        </div>
    );
};
