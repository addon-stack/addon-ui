import React, {type FC, type PropsWithChildren, useEffect, useMemo} from "react";

import {getBrowser} from "adnbn";
import {merge} from "ts-deepmerge";

import config from "#addon-ui/config";
import type {ComponentsProps, Config, ExtraProps, Icons} from "../../types/config";
import {ExtraProvider, IconsProvider, ThemeProvider, type ThemeProviderProps} from "..";

import {type PortalContainer, PortalContext} from "./context";

import "./styles/default.scss";
import "./styles/reset.scss";
import "./styles/base.scss";
import "./styles/document.scss";
import "#addon-ui/style.scss";

export interface UIProviderProps extends Partial<Config>, Pick<ThemeProviderProps, "storage" | "container"> {
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
     * Target for floating layers. Null waits without falling back to document.body.
     */
    portal?: PortalContainer;
}

const UIProvider: FC<PropsWithChildren<UIProviderProps>> = props => {
    const {children, components = {}, extra = {}, icons = {}, storage, view, container = "html", portal} = props;

    const componentsProps = useMemo<ComponentsProps>(() => merge(config.components || {}, components), [components]);

    const extraProps = useMemo<ExtraProps>(() => merge(config.extra || {}, extra), [extra]);

    const svgIcons = useMemo<Icons>(() => ({...config.icons, ...icons}), [icons]);

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
        <ThemeProvider components={componentsProps} storage={storage} container={container}>
            <ExtraProvider extra={extraProps}>
                <PortalContext.Provider value={portal}>
                    <IconsProvider icons={svgIcons}>{children}</IconsProvider>
                </PortalContext.Provider>
            </ExtraProvider>
        </ThemeProvider>
    );
};

UIProvider.displayName = "UIProvider";

export default UIProvider;
