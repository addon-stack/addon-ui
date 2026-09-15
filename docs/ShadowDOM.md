# Shadow DOM

Mount the complete `UIProvider` tree inside each ShadowRoot. The provider still manages theme, storage, component configuration and registered SVG symbols. Its two targets have separate purposes:

- `container?: string | Element | false` receives `theme`, `browser` and `view` attributes. The default is `"html"`; use the shadow host in a content script and `false` while it is unavailable.
- `portal?: Element | DocumentFragment | null` supplies the default target for Dialog (including Modal and Drawer), PopoverContent, SelectContent and Tooltip. Use the ShadowRoot or a sibling element outside the React mount node. `null` waits for a target; `undefined` inherits normal defaults.

The application explicitly supplies both targets. `UIProvider` does not inspect the content-script environment or discover a ShadowRoot to choose them. Omitting the targets keeps the ordinary `"html"` and `document.body` defaults, even when the provider is mounted inside a ShadowRoot.

```tsx
import React, {useCallback, useState} from "react";
import {UIProvider} from "addon-ui";

export function ContentApp() {
    const [root, setRoot] = useState<ShadowRoot | null>(null);
    const ref = useCallback((element: HTMLDivElement | null) => {
        if (element) {
            const tree = element.getRootNode();
            if (tree instanceof ShadowRoot) setRoot(tree);
        }
    }, []);

    return (
        <div ref={ref}>
            <UIProvider container={root?.host ?? false} portal={root}>
                <App />
            </UIProvider>
        </div>
    );
}
```

This component must already be rendered by the application's Shadow DOM adapter. It does not create a shadow tree. The current AddonBone React adapter supplies `anchor`; derive the root through the mounted ref. A direct host/target API in that adapter is a follow-up.

## Portal resolution

Floating components resolve `container` in this order: explicit component prop, component configuration (`ui.config.ts` merged with `UIProvider.components`), `UIProvider.portal`, then Radix's `document.body` default. At every level `undefined` falls through and `null` stops resolution. No Radix Portal is rendered while waiting. Select keeps its items registered in Radix's detached fragment, retains the selected label, and applies a pending open request when its container becomes ready.

The provider's `container` is not a portal target. Changing `portal` does not move the SVG sprite. Keep each instance of IconsProvider and its icons in the same shadow tree; each ShadowRoot needs its own sprite. This also allows the same symbol name in separate roots, including icons in portals into those roots. A portal into another root needs styles and a sprite in that other root.

## CSS delivery with AddonBone

CSS delivery belongs to AddonBone. Shadow DOM integration requires **AddonBone 0.11.0 or newer** and a content script configured with Shadow DOM isolation. All addon-ui stylesheet imports carry `?isolation`, including component CSS Modules, provider base styles and the virtual `#addon-ui/style.scss` overrides. The framework delivers them into the content script's ShadowRoot; popup styles are linked to the popup document as usual. No custom CSS rule or stylesheet loader is needed in the application.

Mark the application's own stylesheet imports with `?isolation` too:

```tsx
import styles from "./panel.module.scss?isolation";
```

The marker applies to that stylesheet and the Sass sources compiled into it. It does not mark separate CSS imports inside third-party components. The virtual module remains named `#addon-ui/style.scss`; only its import carries the query. Styles from `ui.style.scss` already participate through that virtual import.

The automated [integration fixture](../tests/fixtures/shadow-dom/README.md) installs the published `adnbn@0.11.0` from npm and links the current addon-ui source through `file:`. It uses the framework's standard CSS rules, chunk separation, manifest/WAR generation and isolated-styles runtime. A general mechanism for registering unmarked third-party library styles remains a possible follow-up in AddonBone.

A ShadowRoot stylesheet cannot select the outer page's `:root`. The library declares tokens for `:root, :host`; only the relevant selector matches in each tree. Tag reset rules affect elements inside that tree. Typography and text color apply to `body, :host`; document background and `overflow: hidden` apply to `body` only. Virtual user overrides are imported after all library base styles. No `all: initial` reset is used.

```scss
@use "addon-ui/theme" as theme;

@include theme.root {
    --font-size: 15px;
}

.panel {
    @include theme.dark {
        color: white;
    }
    @include theme.rtl {
        flex-direction: row-reverse;
    }
}
```

The `light`, `dark`, `view`, `browser`, `ltr` and `rtl` mixins cover an ordinary ancestor, the component itself, and the shadow host. Host attribute conditions use `:host(:where(...))` to preserve attribute-selector specificity, including when competing with `:hover`.

Rules from the website that directly style the host can override its inherited typography. The host's placement, stacking context, z-index, and transformed/contained ancestors affecting `position: fixed` are the responsibility of the mounting application or AddonBone.

## Focus, scrolling and layers

Modal and Drawer retain Radix's background scroll lock. Their content stops `wheel` and `touchmove` propagation within Shadow DOM without cancelling native scrolling. User handlers run first. Shadow focus handling follows the real active element, cycles Tab/Shift+Tab, handles removed controls, and allows nested Select, Popover and Modal layers. Closing a dialog restores its opener when it is still connected, including compositions without Dialog.Trigger. Autofocus and return-focus callbacks can cancel the default using `preventDefault()`.

Select handles arrow keys, Home/End and typeahead within the shadow tree, skipping disabled options. Escape, selection and return to the trigger retain their Radix behavior. Nested shadow layers receive a stacking order above their parent; an explicit content `style.zIndex` still takes precedence.

Radix's Dialog title diagnostic looks up the title with `document.getElementById`, so it can warn about a valid title inside ShadowRoot. This diagnostic is also present in the installed Radix production bundle. The actual Title and Description remain in the dialog's tree; the wrappers do not patch or silence Radix.

## Toast

Toast stays in its existing viewport and has no provider portal override. In Shadow DOM it supports:

- Tab and Shift+Tab through notifications and their enabled controls, including entry through both viewport focus proxies and exit back to the panel.
- F8 to a connected shadow viewport with an open toast. When several qualify, the last registered viewport wins.
- Pausing the timer while focus remains inside, including after the pointer leaves the notification region.
- Returning focus from a closing toast to its viewport. This covers Escape, the close button, swipe and programmatic closing; an automatic timeout does not take focus away from another control.

With normal Radix Presence, focus returns after the closing animation removes the toast. With `forceMount`, it returns when the retained Root closes; the application still controls the closed node's visibility. If the entire Toast and its viewport are removed, the application is responsible for choosing another focus destination. Focus already moved outside the toast is preserved, and StrictMode's effect replay does not trigger restoration.

F8 arbitration registers shadow viewports only. A page with ordinary DOM viewports keeps Radix's behavior. In a mixed document, an open shadow viewport handles F8 before Radix's document listeners; ordinary viewports do not participate in that selection.
