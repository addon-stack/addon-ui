import React, {useState} from "react";

import {
    Checkbox,
    Footer,
    Header,
    List,
    ListItem,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    Tabs,
    TabsList,
    TabsTrigger,
    TextField,
    TruncateList,
} from "addon-ui";

import styles from "./rtl-layout.module.scss";

export default function RtlLayout() {
    const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

    return (
        <section className={styles.layout} dir={direction} lang="en" data-testid="rtl-layout">
            <button
                data-testid="layout-direction"
                onClick={() => setDirection(value => value === "ltr" ? "rtl" : "ltr")}
            >
                {direction}
            </button>
            <Header
                alignCenter={false}
                title={<span data-testid="layout-heading">Heading</span>}
                subtitle={<span data-testid="layout-subtitle">Subtitle</span>}
                before={<span data-testid="heading-before">B</span>}
                after={<span data-testid="heading-after">A</span>}
            />
            <p data-testid="layout-text">Direction follows dir</p>
            <List>
                <ListItem
                    left={<Checkbox aria-label="Select note" data-testid="list-before" />}
                    primary={<span data-testid="list-text">Note</span>}
                    right={<button data-testid="list-after">Open</button>}
                />
            </List>
            <Select dir={direction} defaultValue="a">
                <SelectTrigger
                    data-testid="layout-select"
                    icon={<span data-testid="select-icon">⌄</span>}
                />
                <SelectContent data-testid="layout-options">
                    <SelectItem value="a" textValue="Alpha" indicator={<span data-testid="select-indicator">✓</span>} />
                    <SelectItem value="b" textValue="Beta" />
                </SelectContent>
            </Select>
            <TextField
                aria-label="Example input"
                before={<span data-testid="field-before">B</span>}
                after={<span data-testid="field-after">A</span>}
            />
            <Footer
                left={<button data-testid="footer-before">Start</button>}
                right={<button data-testid="footer-after">End</button>}
            />
            <Footer
                reverse
                left={<button data-testid="reverse-before">Start</button>}
                right={<button data-testid="reverse-after">End</button>}
            />
            <Footer>
                <button data-testid="children-before">Start</button>
                <button data-testid="children-after">End</button>
            </Footer>
            <Footer reverse>
                <button data-testid="reverse-children-before">Start</button>
                <button data-testid="reverse-children-after">End</button>
            </Footer>
            <Footer left={[
                <button key="first" data-testid="group-before">First</button>,
                <button key="second" data-testid="group-after">Second</button>,
            ]} />
            <Tabs dir={direction} defaultValue="first">
                <TabsList indicatorClassname="layout-indicator">
                    <TabsTrigger data-testid="tab-first" value="first">First</TabsTrigger>
                    <TabsTrigger data-testid="tab-second" value="second">Second</TabsTrigger>
                </TabsList>
            </Tabs>
            <TruncateList
                items={["First", "Second", "Third"]}
                maxVisibleItems={2}
                renderItem={(item, index) => <span key={item} data-testid={`truncate-${index}`}>{item}</span>}
                renderOverflow={items => <span data-testid="truncate-overflow">+{items.length}</span>}
            />
        </section>
    );
}
