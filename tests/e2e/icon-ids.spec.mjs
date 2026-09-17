import {withFirefoxPopup} from "../support/browser/firefox-popup.mjs";
import {expect, test} from "../support/browser/fixtures.mjs";
import {readIconIds} from "../support/browser/icon-ids.mjs";
import {samplePixels} from "../support/browser/pixels.mjs";

const assertIds = ({symbols, uses}) => {
    expect(symbols).toHaveLength(6);
    expect(new Set(symbols).size).toBe(6);
    expect(symbols.every(id => /^addon-ui-[a-f0-9]{32}-[A-Za-z0-9_-]*$/.test(id))).toBe(true);

    expect(uses.map(({key, name, tag, width}) => ({key, name, tag, width}))).toEqual([
        {key: "outer-0", name: "shared", tag: "symbol", width: 24},
        {key: "outer-1", name: "shared space", tag: "symbol", width: 24},
        {key: "outer-2", name: "shared_20_space", tag: "symbol", width: 24},
        {key: "outer-3", name: "50%#😀", tag: "symbol", width: 24},
        {key: "inner", name: "shared", tag: "symbol", width: 16},
        {key: "portal", name: "shared", tag: "symbol", width: 24},
        {key: "sibling", name: "shared", tag: "symbol", width: 16},
    ]);

    expect(uses[0].id).toBe(uses[5].id);
    expect(uses[4].id).not.toBe(uses[6].id);
};

const checkPixels = async (page, capture) => {
    for (const [name, color] of [["outer-3", [255, 0, 0]], ["inner", [0, 0, 255]], ["portal", [255, 0, 0]]]) {
        const [pixel] = await samplePixels(page, await capture(`[data-icon-id-case="${name}"]`), [[0.5, 0.5]]);
        color.forEach((channel, index) => expect(Math.abs(pixel[index] - channel)).toBeLessThanOrEqual(12));
    }
};

test("isolates names, Unicode and portals across nested ShadowRoot providers", async ({page, host}) => {
    const allIds = [];

    for (const scope of [host, page.locator(".addon-ui-host").nth(1)]) {
        await scope.getByTestId("icon-modes-open").click();
        const section = scope.getByTestId("icon-ids");
        await expect(section.locator("symbol")).toHaveCount(6);
        const result = await section.evaluate(readIconIds);
        assertIds(result);
        allIds.push(...result.symbols);
        await checkPixels(page, selector => section.locator(selector).screenshot());
        await scope.getByTestId("icon-mode-next").click();
        expect((await section.evaluate(readIconIds)).symbols).toEqual(result.symbols);
    }

    expect(new Set(allIds).size).toBe(12);
});

test("isolates provider and application IDs in an extension document", async ({page, host, engine, extension}) => {
    if (engine === "firefox") {
        await host.getByTestId("popup-open").click();

        await withFirefoxPopup(extension.debugPort, async ({evaluate, poll, screenshot}) => {
            await poll(() => evaluate(() => !!document.querySelector('[data-testid="icon-modes-open"]')),
                Boolean, "icon controls");

            await evaluate(() => document.querySelector('[data-testid="icon-modes-open"]').click());

            await poll(() => evaluate(() => document.querySelectorAll('[data-testid="icon-ids"] symbol').length),
                value => value === 6, "nested sprite registration");

            assertIds(await evaluate(readIconIds, '[data-testid="icon-ids"]'));
            await checkPixels(page, screenshot);
        });

        return;
    }

    const [popup] = await Promise.all([
        extension.context.waitForEvent("page"), host.getByTestId("popup-open").click(),
    ]);

    await popup.getByTestId("icon-modes-open").click();
    const section = popup.getByTestId("icon-ids");
    await expect(section.locator("symbol")).toHaveCount(6);
    assertIds(await section.evaluate(readIconIds));
    await checkPixels(page, selector => section.locator(selector).screenshot());
});
