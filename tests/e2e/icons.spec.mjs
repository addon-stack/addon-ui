import {withFirefoxPopup} from "../support/browser/firefox-popup.mjs";
import {expect, test} from "../support/browser/fixtures.mjs";
import {samplePixels} from "../support/browser/pixels.mjs";

const expectColors = (pixels, expected) => {
    expected.forEach((color, index) => color.forEach((channel, channelIndex) => {
        expect(Math.abs(pixels[index][channelIndex] - channel),
            `pixel ${index}, channel ${channelIndex}; samples: ${JSON.stringify(pixels)}`)
            .toBeLessThanOrEqual(12);
    }));
};

const checkPaint = async (page, png) => {
    const pixels = await samplePixels(page, png, [
        [4 / 120, 0.5], [35 / 120, 0.5],
        [60 / 120, 0.5], [43 / 120, 3 / 40],
        [100 / 120, 0.5], [83 / 120, 3 / 40],
    ]);

    expectColors(pixels, [
        [226, 0, 29, 255], [29, 0, 226, 255],
        [255, 0, 0, 255], [255, 255, 255, 255],
        [0, 0, 255, 255], [255, 255, 255, 255],
    ]);
};

const checkDimensions = async (page, scope) => {
    for (const name of ["wide-component", "wide-descriptor"]) {
        await expect(scope.locator(`symbol[id="${name}"] svg`)).toHaveAttribute("viewBox", "0 0 80 20");
    }

    // Real SVGR/SVGO drops the redundant viewBox and retains fixed file dimensions.
    for (const name of ["fixed-component", "fixed-descriptor"]) {
        const source = scope.locator(`symbol[id="${name}"] svg`);
        await expect(source).toHaveAttribute("width", "80");
        await expect(source).toHaveAttribute("height", "20");
        await expect(source).not.toHaveAttribute("viewBox");
    }

    await expect(scope.getByTestId("fixed-inline").locator("svg")).not.toHaveAttribute("viewBox");

    for (const mode of ["sprite", "inline"]) {
        const icon = scope.getByTestId(`fixed-${mode}-explicit`);
        await expect(icon).toHaveAttribute("width", "40");
        await expect(icon).toHaveAttribute("viewBox", "0 0 80 20");

        expectColors(await samplePixels(page, await icon.screenshot(), [[0.25, 0.5], [0.75, 0.5]]), [
            [255, 0, 0, 255], [0, 0, 255, 255],
        ]);
    }
};

test("paints sprite gradients, clip paths and masks in ShadowRoots", async ({page, host}) => {
    for (const scope of [host, page.locator(".addon-ui-host").nth(1)]) {
        await scope.getByTestId("icon-modes-open").click();
        await checkPaint(page, await scope.getByTestId("paint-servers").screenshot());
    }
});

test("preserves viewBox and scales fixed-size files with explicit metadata", async ({page, host}) => {
    await host.getByTestId("icon-modes-open").click();
    await checkDimensions(page, host);
});

test("paints resources and fixed-size files in an extension document", async ({page, host, extension, engine}) => {
    if (engine === "firefox") {
        await host.getByTestId("popup-open").click();

        await withFirefoxPopup(extension.debugPort, async ({evaluate, poll, screenshot}) => {
            await poll(() => evaluate(() => !!document.querySelector('[data-testid="icon-modes-open"]')),
                Boolean, "icon controls");

            await evaluate(() => document.querySelector('[data-testid="icon-modes-open"]').click());

            await poll(() => evaluate(() => !!document.querySelector('symbol[id="paint-servers"]')),
                Boolean, "paint resource registration");

            // Juggler cannot inspect extension documents. Firefox's screenshot actor captures the real tab.
            await checkPaint(page, await screenshot('[data-testid="paint-servers"]'));

            for (const mode of ["sprite", "inline"]) {
                expectColors(await samplePixels(page,
                    await screenshot(`[data-testid="fixed-${mode}-explicit"]`), [[0.25, 0.5], [0.75, 0.5]]), [
                    [255, 0, 0, 255], [0, 0, 255, 255],
                ]);
            }
        });

        return;
    }

    const [popup] = await Promise.all([
        extension.context.waitForEvent("page"), host.getByTestId("popup-open").click(),
    ]);

    await popup.getByTestId("icon-modes-open").click();
    await checkPaint(page, await popup.getByTestId("paint-servers").screenshot());
    await checkDimensions(page, popup);
});

const checkModes = async scope => {
    await scope.getByTestId("icon-modes-open").click();
    const sprite = scope.getByTestId("mode-sprite");
    await expect(sprite).toHaveAttribute("viewBox", "0 0 80 20");
    await expect.poll(() => sprite.locator("use").evaluate(element => element.getBBox().width)).toBe(80);
    await expect(scope.getByTestId("mode-portal").locator("use")).toHaveAttribute("href", "#mode-sprite");
    await expect(scope.getByTestId("mode-inline").locator("path")).toHaveCSS("fill", "rgb(120, 30, 180)");
    await expect(scope.getByTestId("mode-inline-second").locator("path")).toHaveCSS("fill", "rgb(20, 100, 160)");

    const loaded = await scope.getByTestId("mode-asset").locator("image").evaluate(async element => {
        const image = new Image();
        image.src = element.getAttribute("href");
        await image.decode();

        return {width: image.naturalWidth, height: image.naturalHeight, box: element.getBBox().width};
    });

    expect(loaded).toEqual({width: 80, height: 20, box: 80});
    await expect(scope.locator('symbol[id="mode-inline"], symbol[id="mode-asset"]')).toHaveCount(0);
    const switched = scope.getByTestId("mode-switch");
    await expect(switched.locator("use")).toHaveCount(1);
    await scope.getByTestId("icon-mode-next").click();
    await expect(switched.locator("path")).toHaveCount(1);
    await expect(scope.locator('symbol[id="mode-switch"]')).toHaveCount(0);
    await scope.getByTestId("icon-mode-next").click();
    await expect(switched.locator("image")).toHaveCount(1);
    await scope.getByTestId("icon-mode-next").click();
    await expect(switched.locator("use")).toHaveCount(1);
    await expect(scope.locator('symbol[id="mode-switch"]')).toHaveCount(1);
};

test("renders SVG file sources in every mode, with lazy styles and independent ShadowRoots", async ({page, host}) => {
    await checkModes(host);
    await checkModes(page.locator(".addon-ui-host").nth(1));
});

test("preserves icon modes in an extension page", async ({host, extension, engine}) => {
    if (engine === "firefox") {
        await host.getByTestId("popup-open").click();

        await withFirefoxPopup(extension.debugPort, async ({evaluate, poll}) => {
            await poll(
                () => evaluate(() => !!document.querySelector('[data-testid="icon-modes-open"]')),
                Boolean, "icon controls"
            );

            await evaluate(() => document.querySelector('[data-testid="icon-modes-open"]').click());

            await poll(
                () => evaluate(() => !!document.querySelector('symbol[id="mode-sprite"]')),
                Boolean, "sprite registration"
            );

            const result = await evaluate(() => {
                const get = id => document.querySelector(`[data-testid="${id}"]`);
                const image = new Image();
                image.src = get("mode-asset").querySelector("image").getAttribute("href");

                image.decode().then(() => {
                    document.body.dataset.iconAssetWidth = String(image.naturalWidth);
                });

                return {
                    viewBox: get("mode-sprite").getAttribute("viewBox"),
                    width: get("mode-sprite").querySelector("use").getBBox().width,
                    portal: get("mode-portal").querySelector("use").getBBox().width,
                    fill: getComputedStyle(get("mode-inline").querySelector("path")).fill,
                    secondFill: getComputedStyle(get("mode-inline-second").querySelector("path")).fill,
                    unexpectedSymbols: document.querySelectorAll(
                        'symbol[id="mode-inline"], symbol[id="mode-asset"]'
                    ).length,
                };
            });

            expect(result).toEqual({
                viewBox: "0 0 80 20", width: 80, portal: 80,
                fill: "rgb(120, 30, 180)", secondFill: "rgb(20, 100, 160)", unexpectedSymbols: 0,
            });

            await poll(
                () => evaluate(() => document.body.dataset.iconAssetWidth),
                value => value === "80", "asset load"
            );

            for (const tag of ["path", "image", "use"]) {
                await evaluate(() => document.querySelector('[data-testid="icon-mode-next"]').click());

                await poll(
                    () => evaluate(tag => !!document.querySelector(`[data-testid="mode-switch"] ${tag}`), tag),
                    Boolean, `mode ${tag}`
                );
            }
        });

        return;
    }

    const [popup] = await Promise.all([
        extension.context.waitForEvent("page"),
        host.getByTestId("popup-open").click(),
    ]);

    await checkModes(popup);
});
