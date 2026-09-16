import {computed, expect, placeLibraryLast, test} from "../support/browser/customization-fixtures.mjs";

test.use({app: "customization"});

async function expectCSS(popup, selector, expected) {
    await expect.poll(() => computed(popup, selector, Object.keys(expected)), {message: selector}).toEqual(expected);
}

for (const libraryLast of [false, true]) {
    const order = libraryLast ? "library CSS last" : "normal build order";

    test(`shared/app TabsTrigger overrides survive ${order}`, async ({popup}) => {
        if (libraryLast) {
            await placeLibraryLast(popup);
        }

        const layout = {
            "flex-direction": "column", gap: "0px", padding: "0px", "z-index": "2", "font-weight": "600",
        };

        await expectCSS(popup, '[data-testid="offers"]', {...layout, color: "rgb(15, 23, 42)"});
        await expectCSS(popup, '[data-testid="coupons"]', {...layout, color: "rgb(106, 106, 108)"});

        // Auto height follows the actual content rather than the library's 40px.
        expect(await popup.evaluate(() => {
            const trigger = document.querySelector('[data-testid="offers"]');

            return trigger.getBoundingClientRect().height ===
                trigger.querySelector("span").getBoundingClientRect().height;
        })).toBe(true);

        await popup.evaluate(() => {
            const trigger = document.querySelector('[data-testid="coupons"]');
            trigger.focus();
            trigger.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
        });

        await expect.poll(() => popup.evaluate(() =>
            document.querySelector('[data-testid="coupons"]').dataset.state)).toBe("active");

        await expectCSS(popup, '[data-testid="coupons"]', {...layout, color: "rgb(15, 23, 42)"});
        await expectCSS(popup, '[data-testid="offers"]', {...layout, color: "rgb(106, 106, 108)"});
        await expectCSS(popup, '[data-testid="coupons"]', {"--active-bg-color": "#123456"});
    });
}

test("defaults, theme mixins, local variables and application layers coexist", async ({popup}) => {
    await placeLibraryLast(popup);

    await expectCSS(popup, '[data-testid="default-button"]', {
        height: "34px", padding: "0px 16px", "border-radius": "10px", "background-color": "rgb(18, 52, 86)",
        position: "relative", "--shared-token": "73px",
    });

    await expectCSS(popup, "body", {"font-size": "15px"});

    await expectCSS(popup, '[data-testid="variable-button"]', {
        height: "28px", padding: "0px 7px", "border-radius": "3px",
    });

    await expectCSS(popup, '[data-testid="custom-button"]', {
        height: "29px", position: "static", color: "rgb(7, 8, 9)",
        "background-color": "rgb(90, 80, 70)", "font-weight": "700",
    });

    await expectCSS(popup, '[data-testid="disabled-button"]', {opacity: "1"});

    await expectCSS(popup, '[data-testid="layered-button"]', {
        height: "31px", "background-color": "rgb(30, 40, 50)",
    });
});

test("focus, accents, fullWidth and ScrollArea remain customizable", async ({popup}) => {
    await placeLibraryLast(popup);

    for (const [id, color, width] of [
        ["focus-field", "rgb(11, 22, 33)", "1px"],
        ["error-field", "rgb(180, 20, 30)", "2px"],
        ["custom-field", "rgb(40, 50, 60)", "3px"],
    ]) {
        await popup.evaluate(id => document.querySelector(`[data-testid="${id}"]`).focus(), id);

        await expectCSS(popup, `div:has(> [data-testid="${id}"])`, {
            "border-top-color": color, "border-top-width": width,
        });
    }

    await expectCSS(popup, 'div:has(> [data-testid="custom-field"])', {"box-shadow": "none"});
    await expectCSS(popup, '[data-testid="textarea"]', {width: "240px"});

    for (const [id, display] of [["scroll-default", "flex"], ["scroll-custom", "block"]]) {
        await expectCSS(popup, `[data-testid="${id}"] [data-radix-scroll-area-viewport] > div`, {display});
    }
});

test("fullscreen Modal defaults and close positioning can be overridden without important", async ({popup}) => {
    await placeLibraryLast(popup);
    await popup.evaluate(() => document.querySelector('[data-testid="modal-open"]').click());

    await expectCSS(popup, '[data-testid="modal"]', {
        "border-radius": "0px", "transition-property": "background-color, transform, opacity, color",
    });

    await expectCSS(popup, '[data-testid="modal"] [aria-label="Close"]', {position: "absolute"});

    await popup.evaluate(() => document.querySelector('[data-testid="modal-customize"]').click());

    await expectCSS(popup, '[data-testid="modal"]', {
        "border-radius": "17px", "transition-property": "opacity", "transition-duration": "0.01s",
    });

    await expectCSS(popup, '[data-testid="modal"] [aria-label="Close"]', {position: "static"});
});

test("a real lazy component stylesheet cannot override an earlier application class", async ({popup}) => {
    const tagCSSLoaded = () => popup.evaluate(() => [...document.styleSheets].some(sheet =>
        [...sheet.cssRules].some(rule => rule.cssText.includes("--tag-padding"))));

    expect(await tagCSSLoaded()).toBe(false);
    await popup.evaluate(() => document.querySelector('[data-testid="lazy-open"]').click());
    await expect.poll(tagCSSLoaded).toBe(true);

    await expectCSS(popup, '[data-testid="lazy-tag"]', {
        padding: "11px", color: "rgb(51, 61, 71)", "background-color": "rgb(81, 91, 101)",
        display: "inline-flex", "font-size": "13px",
    });
});

test("the same shared/app overrides and theme variables reach both existing Shadow roots", async ({page}) => {
    const hosts = page.locator(".addon-ui-host");
    await expect(hosts).toHaveCount(2);

    for (const host of await hosts.all()) {
        await expect(host.getByTestId("offers")).toHaveCSS("padding", "0px");
        await expect(host.getByTestId("offers")).toHaveCSS("color", "rgb(15, 23, 42)");
        await expect(host.getByTestId("custom-button")).toHaveCSS("font-weight", "700");
        await expect(host.getByTestId("default-button")).toHaveCSS("background-color", "rgb(18, 52, 86)");
        await expect(host.getByTestId("variable-button")).toHaveCSS("height", "28px");
    }
});
