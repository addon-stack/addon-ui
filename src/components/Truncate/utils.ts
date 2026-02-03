const MAX_CACHE_SIZE = 1000;
const cache = new Map<string, string>();
let canvas: HTMLCanvasElement | null = null;

const addToCache = (key: string, value: string) => {
    if (cache.size >= MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined) {
            cache.delete(oldestKey);
        }
    }
    cache.set(key, value);
};

export const calculateMiddleTruncate = (
    text: string,
    maxWidth: number,
    font: string,
    letterSpacing: string,
    separator: string
) => {
    const cacheKey = `${text}-${maxWidth}-${font}-${letterSpacing}-${separator}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    if (!canvas) {
        canvas = document.createElement("canvas");
    }
    const context = canvas.getContext("2d");
    if (!context) return text;
    context.font = font;
    context.letterSpacing = letterSpacing;

    const measure = (txt: string) => context.measureText(txt).width;

    if (measure(text) <= maxWidth) {
        addToCache(cacheKey, text);
        return text;
    }

    let low = 0;
    let high = text.length;
    let result = "";

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const leftHalf = Math.ceil(mid / 2);
        const rightHalf = Math.floor(mid / 2);

        const trimmed = text.slice(0, leftHalf) + separator + text.slice(text.length - rightHalf);

        if (measure(trimmed) <= maxWidth) {
            result = trimmed;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const finalResult = result || text[0] + separator + text.slice(-1);
    addToCache(cacheKey, finalResult);
    return finalResult;
};
