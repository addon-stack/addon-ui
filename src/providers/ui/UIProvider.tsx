import React, {FC, PropsWithChildren, useEffect, useMemo} from "react";
import {getBrowser} from "adnbn";

import {merge} from "ts-deepmerge";

import {ExtraProvider} from "../extra";
import {IconsProvider} from "../icons";
import {ThemeProvider, ThemeProviderProps} from "../theme";

import {ComponentsProps, Config, ExtraProps, Icons} from "../../types/config";

import "./styles/default.scss";
import "./styles/reset.scss";
import "addon-ui-style.scss";

import config from "addon-ui-config";

export interface UIProviderProps extends Partial<Config>, Pick<ThemeProviderProps, "storage"> {
    /**
     * A custom view identifier that allows developers to specify a unique name for styling customization.
     * This value is set as a "view" attribute on the container element and can be targeted through SCSS mixins
     * to apply view-specific styles and behavior.
     *
     * @example
     * ```tsx
     * <UIProvider view="dashboard">
     *   <App />
     * </UIProvider>
     * ```
     *
     * @example
     * ```scss
     * @include view("dashboard") {
     *   .some-class {
     *     // Custom styles for dashboard view
     *   }
     * }
     * ```
     */
    view?: string;

    /**
     * The DOM element where the provider will set attributes like "view" and "browser".
     *
     * @remarks
     * - When a string is provided, it's used as a CSS selector to find the element via `document.querySelector`.
     * - When an Element is provided, attributes are set directly on that element.
     * - When `false`, no element attributes are set.
     *
     * Attributes are automatically cleaned up when the component unmounts.
     *
     * @default "html"
     *
     * @example
     * ```tsx
     * // Use default html element
     * <UIProvider>
     *   <App />
     * </UIProvider>
     * ```
     *
     * @example
     * ```tsx
     * // Use custom selector
     * <UIProvider container="#app-root">
     *   <App />
     * </UIProvider>
     * ```
     *
     * @example
     * ```tsx
     * // Use direct element reference
     * <UIProvider container={document.body}>
     *   <App />
     * </UIProvider>
     * ```
     *
     * @example
     * ```tsx
     * // Disable container attributes
     * <UIProvider container={false}>
     *   <App />
     * </UIProvider>
     * ```
     */
    container?: string | Element | false;
}

const UIProvider: FC<PropsWithChildren<UIProviderProps>> = props => {
    const {children, components = {}, extra = {}, icons = {}, storage, view, container = "html"} = props;

    const componentsProps = useMemo<ComponentsProps>(() => merge(config.components || {}, components), [components]);

    const extraProps = useMemo<ExtraProps>(() => merge(config.extra || {}, extra), [extra]);

    const svgIcons = useMemo<Icons>(() => merge(config.icons || {}, icons), [icons]);

    useEffect(() => {
        if (container === false) {
            return;
        }

        const element = typeof container === "string" ? document.querySelector(container) : container;

        if (element) {
            if (view) {
                element.setAttribute("view", view);
            }

            element.setAttribute("browser", getBrowser());

            return () => {
                element.removeAttribute("browser");
                element.removeAttribute("view");
            };
        }
    }, [view, container]);

    return (
        <ThemeProvider components={componentsProps} storage={storage}>
            <ExtraProvider extra={extraProps}>
                <IconsProvider icons={svgIcons}>{children}</IconsProvider>
            </ExtraProvider>
        </ThemeProvider>
    );
};

UIProvider.displayName = "UIProvider";

export default UIProvider;
