import {Meta, StoryObj} from "storybook-react-rsbuild";

import {hideInTable} from "../../utils";

import ScrollAreaComponent from "./ScrollArea";

const meta: Meta<typeof ScrollAreaComponent> = {
    title: "Components/ScrollArea",
    component: ScrollAreaComponent,
    tags: ["autodocs"],
    argTypes: {
        type: {
            description:
                "Describes the nature of scrollbar visibility, similar to how the scrollbar preferences in MacOS control visibility of native scrollbars.",
            options: ["auto", "always", "scroll", "hover"],
            control: {type: "select"},
        },
        scrollHideDelay: {
            description:
                'If type is set to either "scroll" or "hover", this prop determines the length of time, in milliseconds, before the scrollbars are hidden after the user stops interacting with scrollbars.',
        },
        dir: {
            description:
                "The reading direction of the scroll area. If omitted, inherits globally from DirectionProvider or assumes LTR (left-to-right) reading mode.",
            options: ["ltr", "rtl"],
            control: {type: "select"},
        },

        style: hideInTable,
        className: hideInTable,
        thumbClassName: hideInTable,
        cornerClassName: hideInTable,
        viewportClassName: hideInTable,
        scrollbarClassName: hideInTable,
    },
};

export default meta;

export const ScrollArea: StoryObj<typeof ScrollAreaComponent> = {
    args: {
        type: "hover",
        dir: "ltr",
        xOffset: 3,
        yOffset: 3,
        scrollHideDelay: 600,
        style: {
            padding: "10px",
            width: "300px",
            height: "150px",
            borderRadius: "10px",
            color: "var(--text-secondary-color)",
            background: "var(--bg-secondary-color)",
        },
        children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula, justo at congue malesuada, arcu elit malesuada eros, ut tempor justo libero a est. Donec sit amet tortor nec justo auctor sagittis. Suspendisse potenti. Fusce gravida, libero vel auctor pretium, odio risus vehicula nunc, et ultricies nunc arcu a neque. Aliquam erat volutpat. Morbi vulputate erat nec lectus vestibulum, at ullamcorper risus aliquet",
    },
};
