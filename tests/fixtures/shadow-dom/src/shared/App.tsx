import React, {lazy, Suspense, useCallback, useState} from "react";

import {
    Button,
    Drawer,
    Icon,
    Modal,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    Toast,
    Tooltip,
    UIProvider,
    useTheme,
} from "addon-ui";

const LazyPanel = lazy(() => import("./LazyPanel"));
const RtlLayout = lazy(() => import("./RtlLayout"));

const icons = {
    sample: () => <rect x="2" y="3" width="17" height="13" />,
    later: () => <circle cx="12" cy="12" r="9" />,
};

function Controls() {
    const {toggleTheme} = useTheme();
    const [modal, setModal] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [nested, setNested] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastMounted, setToastMounted] = useState(true);
    const [toastForceMount, setToastForceMount] = useState(false);
    const [lazy, setLazy] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [rtlLayout, setRtlLayout] = useState(false);

    const selector = (
        <Select defaultValue="b">
            <SelectTrigger data-testid="select" placeholder="Choose" />
            <SelectContent data-testid="options">
                <SelectItem value="a" textValue="Alpha" />
                <SelectItem value="disabled" disabled textValue="Disabled" />
                <SelectItem value="b" textValue="Beta" />
                <SelectItem value="c" textValue="Charlie" />
                <SelectItem value="ca" textValue="Charlie Alpha" />
                <SelectItem value="d" textValue="Delta" />
            </SelectContent>
        </Select>
    );

    const popover = (
        <Popover>
            <PopoverTrigger asChild>
                <Button data-testid="popover">Popover</Button>
            </PopoverTrigger>
            <PopoverContent data-testid="popover-content">
                <button data-testid="popover-first">First</button>
                <button data-testid="popover-last">Last</button>
                <Icon name="sample" />
            </PopoverContent>
        </Popover>
    );

    return (
        <div style={{width: 340, padding: 16, background: "var(--bg-primary-color)"}} data-testid="panel">
            <button
                data-testid="popup-open"
                onClick={() => chrome.runtime.sendMessage({type: "integration:open-popup"})}
            >
                Open popup page
            </button>
            <h2 data-testid="reset">Shadow UI</h2>
            <button data-testid="theme" onClick={toggleTheme}>
                Theme
            </button>
            <button
                data-testid="rtl"
                onClick={event => {
                    const root = event.currentTarget.getRootNode();
                    const host = root instanceof ShadowRoot ? root.host : document.documentElement;
                    host.setAttribute("dir", host.getAttribute("dir") === "rtl" ? "ltr" : "rtl");
                }}
            >
                Direction
            </button>
            <button data-testid="specificity" className="specificity">
                Hover cascade
            </button>
            <Button data-testid="open-modal" onClick={() => setModal(true)}>
                Modal
            </Button>
            <Button data-testid="open-drawer" onClick={() => setDrawer(true)}>
                Drawer
            </Button>
            <Modal
                open={modal}
                onOpenChange={setModal}
                title="Modal"
                description="Focus and scrolling"
                onWheel={event => {
                    event.currentTarget.dataset.wheels = String(Number(event.currentTarget.dataset.wheels ?? 0) + 1);
                }}
                onTouchMove={event => {
                    event.currentTarget.dataset.touches = String(Number(event.currentTarget.dataset.touches ?? 0) + 1);
                }}
                closeButton={false}
                fullscreen={false}
                data-testid="modal"
            >
                <div>
                    {!empty && (
                        <>
                            <button data-testid="first" onClick={() => setEmpty(true)}>
                                Remove controls
                            </button>
                            <input data-testid="input" />
                            {selector}
                            {popover}
                            <button data-testid="nested" onClick={() => setNested(true)}>
                                Nested modal
                            </button>
                            <button data-testid="last" onClick={() => setModal(false)}>
                                Close
                            </button>
                        </>
                    )}
                    <div data-testid="scroll" style={{height: 160, overflowY: "auto", overscrollBehavior: "contain"}}>
                        <div style={{height: 1000}}>Scrollable content</div>
                    </div>
                    <Modal
                        open={nested}
                        onOpenChange={setNested}
                        title="Nested"
                        description="Child layer"
                        closeButton={false}
                        fullscreen={false}
                        data-testid="nested-modal"
                    >
                        <div>
                            <button data-testid="nested-first">One</button>
                            <button data-testid="nested-close" onClick={() => setNested(false)}>
                                Close child
                            </button>
                        </div>
                    </Modal>
                    <Icon name="sample" />
                </div>
            </Modal>
            <Drawer
                open={drawer}
                onOpenChange={setDrawer}
                title="Drawer"
                description="Scrollable drawer"
                data-testid="drawer"
            >
                <div>
                    <button data-testid="drawer-first">First</button>
                    <div data-testid="drawer-scroll" style={{height: 160, overflowY: "auto"}}>
                        <div style={{height: 1000}}>Scroll</div>
                    </div>
                    <button data-testid="drawer-close" onClick={() => setDrawer(false)}>
                        Close
                    </button>
                </div>
            </Drawer>
            {selector}
            {popover}
            <Tooltip content="Shadow tooltip" delayDuration={0}>
                <button data-testid="tooltip">Tooltip</button>
            </Tooltip>
            <button data-testid="toast-code-close" onClick={() => setToast(false)}>
                Close toast from code
            </button>
            <button
                data-testid="toast-force"
                aria-pressed={toastForceMount}
                onClick={() => setToastForceMount(value => !value)}
            >
                Force mount
            </button>
            <button
                data-testid="toast-remove"
                onClick={() => {
                    setToastMounted(value => !value);
                    setToast(false);
                }}
            >
                Toggle toast mount
            </button>
            <button data-testid="toast-open" onClick={() => setToast(true)}>
                Toast
            </button>
            {toastMounted && (
                <Toast
                    forceMount={toastForceMount || undefined}
                    data-forced={toastForceMount || undefined}
                    open={toast}
                    onOpenChange={setToast}
                    duration={1500}
                    title="Shadow toast"
                    action={<button data-testid="toast-action">Action</button>}
                    onClose={() => setToast(false)}
                    data-testid="toast"
                />
            )}
            <Icon name="sample" data-testid="icon" />
            <button data-testid="lazy-open" onClick={() => setLazy(true)}>
                Load lazy
            </button>
            {lazy && (
                <Suspense fallback="Loading">
                    <LazyPanel />
                    <Icon name="later" data-testid="late-icon" />
                </Suspense>
            )}
            <button data-testid="rtl-layout-open" onClick={() => setRtlLayout(true)}>
                Direction layout
            </button>
            {rtlLayout && (
                <Suspense fallback="Loading layout">
                    <RtlLayout />
                </Suspense>
            )}
        </div>
    );
}

export default function App({shadow = false}: {shadow?: boolean}) {
    const [root, setRoot] = useState<ShadowRoot | null>(null);

    const ref = useCallback((element: HTMLDivElement | null) => {
        if (element) {
            const target = element.getRootNode();

            if (target instanceof ShadowRoot) {
                setRoot(target);
            }
        }
    }, []);

    const rootIcons =
        root && (root.host as HTMLElement).style.left === "390px"
            ? {...icons, sample: () => <rect x="2" y="3" width="9" height="13" />}
            : icons;

    return (
        <div ref={ref}>
            <UIProvider
                container={shadow ? (root?.host ?? false) : "html"}
                portal={shadow ? root : undefined}
                icons={rootIcons}
            >
                <Controls />
            </UIProvider>
        </div>
    );
}
