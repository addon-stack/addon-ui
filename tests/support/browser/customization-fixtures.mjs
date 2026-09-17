import {withFirefoxPopup} from "./firefox-popup.mjs";
import {expect, test as base} from "./fixtures.mjs";

export const test = base.extend({
    popup: async ({extension, engine, host}, use) => {
        if (engine === "firefox") {
            await host.getByTestId("popup-open").click();
            await expect(host.getByTestId("popup-open")).toHaveAttribute("data-opened", "true");

            await withFirefoxPopup(extension.debugPort, async ({evaluate}) => {
                await expect.poll(() => evaluate(() => !!document.querySelector('[data-testid="panel"]'))).toBe(true);
                await use({evaluate});
            });
        } else {
            const loaded = extension.context.waitForEvent("page");
            await host.getByTestId("popup-open").click();
            const page = await loaded;
            await expect(page.getByTestId("panel")).toBeVisible();
            await use({evaluate: (fn, argument) => page.evaluate(fn, argument)});
        }
    },
});

export {expect};

export function computed(popup, selector, properties) {
    return popup.evaluate(({selector, properties}) => {
        const element = document.querySelector(selector);

        if (!element) {
            return null;
        }

        const style = getComputedStyle(element);

        return Object.fromEntries(properties.map(property => [property, style.getPropertyValue(property).trim()]));
    }, {selector, properties});
}

// Reinsert the actual emitted rules in the worst source order. Keep application
// layers and the documented unlayered Chrome body defaults in their original order.
export async function placeLibraryLast(popup) {
    const moved = await popup.evaluate(() => {
        const library = [];

        for (const sheet of document.styleSheets) {
            for (let index = sheet.cssRules.length - 1; index >= 0; index--) {
                const rule = sheet.cssRules[index];

                if (rule instanceof CSSLayerBlockRule && rule.name.startsWith("addon-ui.")) {
                    library.unshift(rule.cssText);
                    sheet.deleteRule(index);
                }
            }
        }

        const late = document.createElement("style");
        late.textContent = library.join("\n");
        document.head.append(late);

        return library.length;
    });

    expect(moved, "Move real library layer blocks, not an empty stylesheet").toBeGreaterThan(0);
}
