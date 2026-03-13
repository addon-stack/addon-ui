import React from "react";
import {Meta, StoryObj} from "storybook-react-rsbuild";

import {capitalizeFirstLetter, hideInTable} from "../../utils";

import HighlightComponent from "./Highlight";
import {HighlightColor} from "./types";

const colors: (HighlightColor | "default")[] = [
    "default",
    HighlightColor.Primary,
    HighlightColor.Secondary,
    HighlightColor.Accent,
];
const searchWords = ["Adjust", "volume", "switch", "audio"];
const textToHighlight = "Adjust the current tab's volume with the slider. Switch to any audio tab in one click";

const meta: Meta<typeof HighlightComponent> = {
    title: "Components/Highlighter",
    component: HighlightComponent,
    tags: ["autodocs"],
    argTypes: {
        color: {
            options: colors,
            control: {type: "select"},
        },
        searchWords: {
            description:
                "Array of search words. String search terms are automatically cast to RegExps unless autoEscape is true.",
        },
        activeIndex: {
            description: "Specify the match index that should be actively highlighted. Use along with activeClassName",
        },
        caseSensitive: {
            description: "Search should be case sensitive; defaults to false",
        },
        textToHighlight: {
            description: "Text to highlight matches in",
        },

        style: hideInTable,
        children: hideInTable,
        className: hideInTable,
    },
    decorators: [
        Story => (
            <div style={{color: "var(--text-primary-color"}}>
                <Story />
            </div>
        ),
    ],
};

export default meta;

export const Highlight: StoryObj<typeof HighlightComponent> = {
    args: {
        searchWords,
        textToHighlight,
        color: undefined,
        activeIndex: 0,
        caseSensitive: true,
    },
};

export const Color = () => {
    return (
        <div>
            {colors.map(color => (
                <div key={color} style={{margin: "20px", display: "flex", alignItems: "center"}}>
                    <span className="item-card__title" style={{width: "150px"}}>
                        {capitalizeFirstLetter(color)} color
                    </span>

                    <HighlightComponent
                        searchWords={searchWords}
                        textToHighlight={textToHighlight}
                        color={color !== "default" ? color : undefined}
                        activeIndex={0}
                    />
                </div>
            ))}
        </div>
    );
};
