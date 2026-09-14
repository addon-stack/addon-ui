/* eslint-disable @typescript-eslint/no-explicit-any */

export const HideInTable = {table: {disable: true}};

export const capitalizeFirstLetter = (text: string) => {
    if (text.length < 2) return text;
    return text[0].toUpperCase() + text.slice(1);
};

export const splitProps = <T extends object>(props: Record<string, any>, keys: Set<keyof T>) => {
    return Object.fromEntries(Object.entries(props).filter(([key]) => keys.has(key as keyof T))) as T;
};
