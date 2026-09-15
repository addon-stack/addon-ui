import {expect, test} from "../support/browser/fixtures.mjs";

async function expectOrder(first, second, direction) {
    await expect.poll(async () => {
        const a = await first.boundingBox();
        const b = await second.boundingBox();

        return a && b ? Math.sign(b.x - a.x) : 0;
    }).toBe(direction === "ltr" ? 1 : -1);
}

async function expectIndicator(layout) {
    await expect.poll(async () => {
        const active = await layout.locator('[role="tab"][data-state="active"]').boundingBox();
        const indicator = await layout.locator(".layout-indicator").boundingBox();

        return active && indicator
            ? Math.abs(active.x - indicator.x) + Math.abs(active.width - indicator.width)
            : Infinity;
    }).toBeLessThan(1);

    const first = await layout.getByTestId("tab-first").getAttribute("data-state") === "active";
    const rtl = await layout.getAttribute("dir") === "rtl";

    const corners = await layout.locator(".layout-indicator").evaluate(element => {
        const css = getComputedStyle(element);

        return [parseFloat(css.borderTopLeftRadius), parseFloat(css.borderTopRightRadius)];
    });

    expect(corners[first === rtl ? 1 : 0]).toBe(0);
    expect(corners[first === rtl ? 0 : 1]).toBeGreaterThan(0);
}

for (const surface of ["shadow", "document"]) {
    test(`mirrors component layout and text in the ${surface} after direction changes`, async ({
        host,
        page,
        extension,
        engine,
    }) => {
        test.skip(surface === "document" && engine === "firefox", "Firefox Juggler skips moz-extension documents");

        let root = host;
        let targetPage = page;

        if (surface === "document") {
            const css = await host.locator('link[rel="stylesheet"]').first().getAttribute("href");
            targetPage = await extension.context.newPage();
            await targetPage.goto(new URL("/popup.html", css).href);
            root = targetPage.locator("html");
        }

        // A nested explicit LTR must win over an RTL ancestor, including across a shadow boundary.
        await root.evaluate(element => element.setAttribute("dir", "rtl"));
        await root.getByTestId("rtl-layout-open").click();
        const layout = root.getByTestId("rtl-layout");
        await expect(layout).toBeVisible();

        for (const direction of ["ltr", "rtl", "ltr"]) {
            if (await layout.getAttribute("dir") !== direction) {
                await layout.getByTestId("layout-direction").click();
            }

            await expect(layout).toHaveCSS("direction", direction);
            await expect(layout).toHaveAttribute("lang", "en");

            for (const prefix of ["heading", "list", "field", "footer", "children", "group"]) {
                await expectOrder(
                    layout.getByTestId(`${prefix}-before`), layout.getByTestId(`${prefix}-after`), direction
                );
            }

            for (const prefix of ["reverse", "reverse-children"]) {
                await expectOrder(
                    layout.getByTestId(`${prefix}-before`),
                    layout.getByTestId(`${prefix}-after`),
                    direction === "ltr" ? "rtl" : "ltr"
                );
            }

            const textAlignment = await layout.getByTestId("layout-text").evaluate(element => {
                const range = document.createRange();
                range.selectNodeContents(element);
                const text = range.getBoundingClientRect();
                const block = element.getBoundingClientRect();

                return {left: Math.abs(text.left - block.left), right: Math.abs(text.right - block.right)};
            });

            expect(textAlignment[direction === "rtl" ? "right" : "left"]).toBeLessThan(1);

            const select = layout.getByTestId("layout-select");
            await expectOrder(select.locator(":scope > span").first(), layout.getByTestId("select-icon"), direction);
            await select.click();
            const options = root.getByTestId("layout-options");
            await expect(options).toHaveAttribute("dir", direction);
            const selected = options.getByRole("option", {name: "Alpha"});

            await expectOrder(
                selected.locator(":scope > span").first(), selected.locator(":scope > span").last(), direction
            );

            await targetPage.keyboard.press("Escape");
            await expect(options).toHaveCount(0);

            await expectOrder(layout.getByTestId("truncate-0"), layout.getByTestId("truncate-1"), direction);
            await expectOrder(layout.getByTestId("truncate-1"), layout.getByTestId("truncate-overflow"), direction);
            await expectOrder(layout.getByTestId("tab-first"), layout.getByTestId("tab-second"), direction);
            await expectIndicator(layout);
            await layout.getByTestId("tab-first").focus();
            await targetPage.keyboard.press(direction === "rtl" ? "ArrowLeft" : "ArrowRight");
            await expect(layout.getByTestId("tab-second")).toHaveAttribute("data-state", "active");
            await expectIndicator(layout);
        }
    });
}
