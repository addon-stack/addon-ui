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
        middle: true,
        separator: "...",
    },

    render: props => <TruncateStoryRender {...props} />,
};

const TruncateStoryRender = (props: TruncateProps) => {
    const [searchWords, setSearchWords] = useState("");

    const filteredItems = list.filter(({title, url}) => {
        const value = searchWords.toLowerCase();
        return title.toLowerCase().includes(value) || url.toLowerCase().includes(value);
    });

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "20px", alignItems: "center"}}>
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
                                {...props}
                            />
                            <div style={{display: "flex", alignItems: "center", minWidth: 0}}>
                                <TruncateComponent
                                    text={url}
                                    render={text => <Highlight textToHighlight={text} searchWords={[searchWords]} />}
                                    {...props}
                                />
                                <button style={{marginLeft: "10px"}}>Open</button>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </ViewportProvider>
        </div>
    );
};

export const Inline: StoryObj<TruncateProps> = {
    args: {
        text: "Very long text that should be truncated to fit in line with a button",
        middle: true,
    },

    render: props => (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Header title="Inline Truncate" />
            <div
                style={{
                    marginTop: "10px",
                    resize: "horizontal",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "400px",
                }}
            >
                <TruncateComponent {...props} />
            </div>

            <Header title="Inline Truncate with Button (flex-start)" />
            <div
                style={{
                    marginTop: "10px",
                    resize: "horizontal",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "300px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <TruncateComponent {...props} />
                <button style={{marginLeft: "10px"}}>Button</button>
            </div>
        </div>
    ),
};
