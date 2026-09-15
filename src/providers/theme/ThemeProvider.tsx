import React, {type FC, type PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";

import type {Config} from "../../types/config";
import {Theme, type ThemeStorageContract} from "../../types/theme";

import {ThemeContext} from "./context";
import {isDarkMedia, isValid} from "./theme-utils";
import ThemeStorage from "./ThemeStorage";

export interface ThemeProviderProps extends Pick<Config, "components"> {
    /**
     * Theme persistence storage configuration.
     *
     * @remarks
     * - When `undefined`, theme changes are stored only in component state (memory) and reset on page reload.
     * - When `true`, uses the default `ThemeStorage` implementation (typically localStorage).
     * - When a custom `ThemeStorageContract` object is provided, uses that implementation for theme persistence.
     *
     * The storage is used to save, retrieve, and watch for theme changes across sessions or tabs.
     *
     * @default undefined
     *
     * @example
     * ```tsx
     * // No persistence (memory only)
     * <ThemeProvider>
     *   <App />
     * </ThemeProvider>
     * ```
     *
     * @example
     * ```tsx
     * // Use default storage (localStorage)
     * <ThemeProvider storage={true}>
     *   <App />
     * </ThemeProvider>
     * ```
     *
     * @example
     * ```tsx
     * // Use custom storage implementation
     * const customStorage: ThemeStorageContract = {
     *   get: async () => { ... },
     *   change: async (theme) => { ... },
     *   toggle: async () => { ... },
     *   watch: (callback) => { ... }
     * };
     *
     * <ThemeProvider storage={customStorage}>
     *   <App />
     * </ThemeProvider>
     * ```
     */
    storage?: ThemeStorageContract | true;
    /**
     * The DOM element where the provider will set attributes "browser"
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
     * <ThemeProviderProps>
     *   <App />
     * </ThemeProviderProps>
     * ```
     *
     * @example
     * ```tsx
     * // Use custom selector
     * <ThemeProviderProps container="#app-root">
     *   <App />
     * </ThemeProviderProps>
     * ```
     *
     * @example
     * ```tsx
     * // Use direct element reference
     * <ThemeProviderProps container={document.body}>
     *   <App />
     * </ThemeProviderProps>
     * ```
     *
     * @example
     * ```tsx
     * // Disable container attributes
     * <ThemeProviderProps container={false}>
     *   <App />
     * </ThemeProviderProps>
     * ```
     */
    container?: string | Element | false;
}

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = props => {
    const {children, components, storage, container} = props;

    const [theme, setTheme] = useState<Theme>(() => (isDarkMedia() ? Theme.Dark : Theme.Light));

    const currentStorage: ThemeStorageContract | undefined = useMemo(() => {
        if (!storage) {
            return;
        }

        if (storage === true) {
            return new ThemeStorage();
        }

        return storage;
    }, [storage]);

    const changeTheme = useCallback((theme: Theme) => {
        setTheme(theme);

        if (currentStorage) {
            currentStorage
                .change(theme)
                .catch(e => console.error("ThemeProvider: set theme to storage error", e));
        }
    }, [currentStorage]);

    const toggleTheme = useCallback(() => {
        changeTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
    }, [theme, changeTheme]);

    useEffect(() => {
        if (!currentStorage) {
            return;
        }

        currentStorage
            .get()
            .then(newTheme => isValid(newTheme) && setTheme(newTheme))
            .catch(e => console.error("ThemeProvider: get theme from storage error", e));

        const unsubscribe = currentStorage.watch(newTheme => isValid(newTheme) && setTheme(newTheme));

        return () => unsubscribe();
    }, [currentStorage]);

    useEffect(() => {
        if (container === false) {
            return;
        }

        const element = typeof container === "string" ? document.querySelector(container) : container;

        if (element) {
            element.setAttribute("theme", theme);

            return () => {
                element.removeAttribute("theme");
            };
        }
    }, [theme, container]);

    return (
        <ThemeContext.Provider value={{theme, changeTheme, toggleTheme, components}}>{children}</ThemeContext.Provider>
    );
};

ThemeProvider.displayName = "ThemeProvider";

export default ThemeProvider;
