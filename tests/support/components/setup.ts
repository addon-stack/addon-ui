Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
window.matchMedia = jest.fn().mockReturnValue({matches: false});
globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};
HTMLElement.prototype.scrollIntoView = jest.fn();
// jsdom has no top layer; nwsapi recurses for these newer selectors used by Floating UI.
const nativeMatches = Element.prototype.matches;
Element.prototype.matches = function (selector) {
    return selector === ":popover-open" || selector === ":modal" ? false : nativeMatches.call(this, selector);
};
