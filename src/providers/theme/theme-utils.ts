import {Theme} from "../../types/theme";

export const isDarkMedia = () => window?.matchMedia("(prefers-color-scheme: dark)")?.matches;

export const isValid = (theme: Theme | undefined): theme is Theme => {
    return !!theme && [Theme.Light, Theme.Dark].includes(theme);
};
