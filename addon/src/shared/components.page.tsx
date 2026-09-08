import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
    Avatar,
    BaseButton,
    Button,
    ButtonColor,
    ButtonVariant,
    Checkbox,
    Drawer,
    Footer,
    Header,
    Highlight,
    Icon,
    IconButton,
    List,
    ListItem,
    Modal,
    Odometer,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollArea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tag,
    TextArea,
    TextField,
    Toast,
    Tooltip,
    Truncate,
    TruncateList,
    UIProvider,
    View,
    ViewportMode,
    ViewportProvider,
    useTheme,
} from "addon-ui";
import "./playground.scss";

function Section({title, children}: React.PropsWithChildren<{title: string}>) {
    return (
        <section className="playground-section">
            <h2>{title}</h2>
            {children}
        </section>
    );
}

function Playground() {
    const {theme, toggleTheme} = useTheme();
    const [clicks, setClicks] = useState(0);
    const [text, setText] = useState("Addon UI");
    const [browser, setBrowser] = useState("chrome");
    const [checked, setChecked] = useState(false);
    const [enabled, setEnabled] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    useEffect(() => {
        const previousDirection = document.documentElement.getAttribute("dir");
        document.documentElement.dir = "ltr";
        return () => {
            if (previousDirection === null) document.documentElement.removeAttribute("dir");
            else document.documentElement.setAttribute("dir", previousDirection);
        };
    }, []);

    return (
        <main className="playground">
            <title>Addon UI · Playground</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Header title="Addon UI Playground" alignCenter={false}>
                <Button variant={ButtonVariant.Outlined} onClick={toggleTheme}>
                    Theme: {theme}
                </Button>
            </Header>

            <Section title="Button / BaseButton / IconButton">
                <div className="playground-row">
                    {Object.values(ButtonVariant).map(variant => (
                        <Button
                            key={variant}
                            variant={variant}
                            color={ButtonColor.Primary}
                            onClick={() => setClicks(n => n + 1)}
                        >
                            {variant}
                        </Button>
                    ))}
                    <Button disabled>Disabled</Button>
                    <BaseButton onClick={() => setClicks(n => n + 1)}>BaseButton</BaseButton>
                    <IconButton aria-label="Help" onClick={() => setClicks(n => n + 1)}>
                        <Icon name="help" />
                    </IconButton>
                </div>
                <p role="status">Clicks: {clicks}</p>
            </Section>

            <Section title="TextField / TextArea / Select">
                <TextField label="Text" value={text} onChange={event => setText(event.currentTarget.value)} fullWidth />
                <TextArea aria-label="Description" placeholder="Type a description" />
                <Select value={browser} onValueChange={setBrowser}>
                    <SelectTrigger aria-label="Browser" placeholder="Choose a browser" />
                    <SelectContent>
                        <SelectItem value="chrome" textValue="Chrome" />
                        <SelectItem value="firefox" textValue="Firefox" />
                    </SelectContent>
                </Select>
                <p>
                    Value: {text} / {browser}
                </p>
            </Section>

            <Section title="Checkbox / Switch">
                <div className="playground-row">
                    <label className="playground-row">
                        <Checkbox checked={checked} onCheckedChange={value => setChecked(value === true)} />
                        Checkbox: {String(checked)}
                    </label>
                    <label className="playground-row">
                        <Switch checked={enabled} onCheckedChange={setEnabled} />
                        Switch: {String(enabled)}
                    </label>
                </div>
            </Section>

            <Section title="Avatar / Tag / Odometer / Icon">
                <div className="playground-row">
                    <Avatar fallback="UI" />
                    <Tag>Addon UI</Tag>
                    <Odometer value={clicks} />
                    <Icon name="help" />
                    <Icon name="close" />
                </div>
            </Section>

            <Section title="Highlight / Truncate / TruncateList">
                <Highlight textToHighlight={`${text} — component example`} searchWords={[text]} autoEscape />
                <div className="playground-truncate">
                    <Truncate text="addon-ui / components / a-long-component-name.tsx" middle />
                    <TruncateList>
                        {["Button", "TextField", "Checkbox", "Switch", "Modal", "Drawer"].map(name => (
                            <Tag key={name}>{name}</Tag>
                        ))}
                    </TruncateList>
                </div>
            </Section>

            <Section title="Tabs / Accordion">
                <Tabs defaultValue="first">
                    <TabsList aria-label="Example tabs">
                        <TabsTrigger value="first">First tab</TabsTrigger>
                        <TabsTrigger value="second">Second tab</TabsTrigger>
                    </TabsList>
                    <TabsContent value="first">First tab content</TabsContent>
                    <TabsContent value="second">Second tab content</TabsContent>
                </Tabs>
                <Accordion type="single" collapsible>
                    {["First", "Second"].map(name => (
                        <AccordionItem key={name} value={name}>
                            <AccordionHeader>
                                <AccordionTrigger asChild>
                                    <Button variant={ButtonVariant.Text}>{name} section</Button>
                                </AccordionTrigger>
                            </AccordionHeader>
                            <AccordionContent>{name} section content</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Section>

            <Section title="Modal / Drawer">
                <div className="playground-row">
                    <Button onClick={() => setModalOpen(true)}>Open modal</Button>
                    <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
                </div>
                <Modal
                    title="Modal"
                    description="Modal component example"
                    fullscreen={false}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                >
                    <div className="playground-section">
                        <h2>Modal</h2>
                        <p>Close with Escape, the close icon, or the button.</p>
                        <Button onClick={() => setModalOpen(false)}>Close modal</Button>
                    </div>
                </Modal>
                <Drawer
                    title="Drawer"
                    description="Drawer component example"
                    open={drawerOpen}
                    onOpenChange={setDrawerOpen}
                >
                    <div className="playground-section">
                        <h2>Drawer</h2>
                        <p>Content uses the library theme.</p>
                        <Button onClick={() => setDrawerOpen(false)}>Close drawer</Button>
                    </div>
                </Drawer>
            </Section>

            <Section title="Toast / Tooltip / Popover">
                <div className="playground-row">
                    <Toast
                        title="Test notification"
                        description="Toast component example"
                        open={toastOpen}
                        onOpenChange={setToastOpen}
                        onClose={() => setToastOpen(false)}
                        duration={3000}
                    >
                        <Button onClick={() => setToastOpen(true)}>Show toast</Button>
                    </Toast>
                    <Tooltip content="Tooltip component example">
                        <Button>Hover or focus</Button>
                    </Tooltip>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button>Open popover</Button>
                        </PopoverTrigger>
                        <PopoverContent>Popover component example</PopoverContent>
                    </Popover>
                </div>
            </Section>

            <Section title="View / Header / Footer / List / ScrollArea / Viewport">
                <ViewportProvider mode={ViewportMode.Fixed}>
                    <View
                        title="Example view"
                        showSeparate
                        className="playground-view"
                        bodyClassName="playground-view-body"
                    >
                        <ScrollArea type="always">
                            <List>
                                {Array.from({length: 12}, (_, i) => (
                                    <ListItem key={i}>Item {i + 1}</ListItem>
                                ))}
                            </List>
                        </ScrollArea>
                    </View>
                    <Footer>Footer</Footer>
                </ViewportProvider>
            </Section>
        </main>
    );
}

export default function App() {
    return (
        <UIProvider view="playground">
            <Playground />
        </UIProvider>
    );
}
