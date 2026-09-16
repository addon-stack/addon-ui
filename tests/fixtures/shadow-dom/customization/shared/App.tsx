import React, {lazy, Suspense, useState} from "react";

import {
    Button,
    ButtonColor,
    Modal,
    ModalRadius,
    ScrollArea,
    Tabs,
    TabsList,
    TabsTrigger,
    TextArea,
    TextField,
    TextFieldAccent,
    TextFieldVariant,
    UIProvider,
    type UIProviderProps,
} from "addon-ui";

import styles from "./popup.scss?isolation";

const LazyTag = lazy(() => import("./LazyTag"));

export default function App({container, portal}: Pick<UIProviderProps, "container" | "portal">) {
    const [lazy, setLazy] = useState(false);
    const [modal, setModal] = useState(false);
    const [customModal, setCustomModal] = useState(false);

    return (
        <UIProvider container={container} portal={portal}>
            <div data-testid="panel" className={styles.panel}>
                <button
                    data-testid="popup-open"
                    onClick={async event => {
                        const button = event.currentTarget;
                        await chrome.runtime.sendMessage({type: "integration:open-popup"});
                        button.dataset.opened = "true";
                    }}
                >
                    Open popup
                </button>
                <Tabs defaultValue="offers">
                    <TabsList>
                        <TabsTrigger data-testid="offers" value="offers" className={styles["tabs__trigger"]}>
                            Offers
                        </TabsTrigger>
                        <TabsTrigger data-testid="coupons" value="coupons" className={styles["tabs__trigger"]}>
                            Coupons
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button data-testid="default-button" color={ButtonColor.Primary}>
                    Default
                </Button>
                <Button data-testid="variable-button" className={styles.variables}>
                    Variables
                </Button>
                <Button data-testid="custom-button" color={ButtonColor.Primary} className={styles.custom}>
                    Class
                </Button>
                <Button data-testid="disabled-button" disabled className={styles.custom}>
                    Disabled
                </Button>
                <Button data-testid="layered-button" color={ButtonColor.Primary} className={styles.layered}>
                    Application layer
                </Button>
                <TextField data-testid="focus-field" variant={TextFieldVariant.Outlined} />
                <TextField
                    data-testid="error-field"
                    accent={TextFieldAccent.Error}
                    variant={TextFieldVariant.Outlined}
                />
                <TextField data-testid="custom-field" accent={TextFieldAccent.Error} className={styles.field} />
                <TextArea data-testid="textarea" fullWidth className={styles.textarea} />
                <ScrollArea data-testid="scroll-default">
                    <span>Default scroll content</span>
                </ScrollArea>
                <ScrollArea data-testid="scroll-custom" className={styles.scroll}>
                    <span>Custom scroll content</span>
                </ScrollArea>
                <Button data-testid="modal-open" onClick={() => setModal(true)}>
                    Modal
                </Button>
                <Modal
                    open={modal}
                    onOpenChange={setModal}
                    title="Customization"
                    description="Fullscreen defaults and application overrides"
                    radius={ModalRadius.Large}
                    data-testid="modal"
                    className={customModal ? styles.modal : undefined}
                    closeButton={{className: customModal ? styles.close : undefined}}
                >
                    <button data-testid="modal-customize" onClick={() => setCustomModal(true)}>Customize</button>
                </Modal>
                <button data-testid="lazy-open" onClick={() => setLazy(true)}>Load tag</button>
                {lazy && (
                    <Suspense fallback="Loading">
                        <LazyTag className={styles.lazy} />
                    </Suspense>
                )}
            </div>
        </UIProvider>
    );
}
