export const measure = (el: HTMLElement, txt: string) => {
    el.textContent = txt;
    return el.scrollWidth <= el.clientWidth;
};

export const binaryTrim = (el: HTMLElement, text: string, generator: (size: number) => string) => {
    let low = 0;
    let high = text.length;
    let result = "";

    while (low <= high) {
        const size = Math.floor((low + high) / 2);

        const trimmed = generator(size);

        if (measure(el, trimmed)) {
            result = trimmed;
            low = size + 1;
        } else {
            high = size - 1;
        }
    }

    return result;
};

export const trimEnd = (el: HTMLElement, text: string, separator: string) => {
    if (measure(el, text)) return text;

    const generator = (size: number) => text.slice(0, size) + separator;

    const best = binaryTrim(el, text, generator);

    return best || text.charAt(0) + separator;
};

export const trimMiddle = (el: HTMLElement, text: string, separator: string) => {
    if (measure(el, text)) return text;

    const generator = (size: number) => {
        const left = text.slice(0, Math.ceil(size / 2));
        const right = text.slice(text.length - Math.floor(size / 2));
        return left + separator + right;
    };

    const best = binaryTrim(el, text, generator);

    return best || text.charAt(0) + separator + text.charAt(text.length - 1);
};

export const trimUrl = (el: HTMLElement, url: string, separator: string) => {
    let host = url;
    let path = "";

    try {
        const u = new URL(url);
        host = `${u.protocol}//${u.host}`;
        path = u.pathname + u.search + u.hash;
    } catch {
        return trimEnd(el, url, separator);
    }

    if (measure(el, url)) return url;

    const generator = (size: number) => {
        const left = path.slice(0, Math.ceil(size / 2));
        const right = path.slice(path.length - Math.floor(size / 2));
        return host + left + separator + right;
    };

    const best = binaryTrim(el, path, generator);

    return best || trimEnd(el, url, separator);
};
