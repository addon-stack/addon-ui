import {test, expect} from "../support/browser/fixtures.mjs";

test("isolates base styles, reset and virtual overrides", async ({page, host}) => {
    const initial = await page.evaluate(() => ({
        titleMargin: getComputedStyle(document.querySelector("#site-title")).marginTop,
        bodyMargin: getComputedStyle(document.body).margin,
        htmlAttrs: ["theme", "browser", "view"].map(key => document.documentElement.getAttribute(key)),
        links: [...document.querySelector(".addon-ui-host").shadowRoot.querySelectorAll('link[rel="stylesheet"]')].map(
            link => link.href
        ),
    }));
    expect(initial.titleMargin).toBe("31px");
    expect(initial.bodyMargin).toBe("23px");
    expect(initial.htmlAttrs).toEqual([null, null, null]);
    expect(initial.links.length).toBeGreaterThan(0);
    await expect(host.getByTestId("reset")).toHaveCSS("margin-top", "0px");
    const token = await host.evaluate(el => getComputedStyle(el).getPropertyValue("--integration-token").trim());
    expect(token).toBe("73px");
});

test("applies theme, RTL, host specificity and Tooltip", async ({page, host}) => {
    // Theme/host specificity and direct site host typography.
    await host.getByTestId("theme").click();
    await expect(host).toHaveAttribute("theme", "dark");
    await host.getByTestId("specificity").hover();
    await expect(host.getByTestId("specificity")).toHaveCSS("color", "rgb(1, 2, 3)");
    await expect(host).toHaveCSS("font-size", "19px");
    await host.getByTestId("rtl").click();
    expect(
        await host
            .getByTestId("panel")
            .evaluate(el => getComputedStyle(el).getPropertyValue("--integration-rtl").trim())
    ).toBe("yes");
    await host.getByTestId("tooltip").hover();
    await expect(host.getByRole("tooltip")).toHaveText("Shadow tooltip");
    await page.mouse.move(1000, 800, {steps: 8});
    await expect(host.getByRole("tooltip")).toHaveCount(0);
});

test("loads lazy CSS and registers SVG independently in both roots", async ({page, host}) => {
    await host.getByTestId("lazy-open").click();
    await expect(host.getByTestId("lazy")).toHaveCSS("border-top-width", "7px");
    const second = page.locator(".addon-ui-host").nth(1);
    await second.getByTestId("lazy-open").click();
    await expect(second.getByTestId("lazy")).toHaveCSS("border-top-width", "7px");
    expect(
        await second
            .getByTestId("late-icon")
            .locator("use")
            .evaluate(el => el.getBBox().width)
    ).toBeGreaterThan(0);
    const svg = await page.evaluate(() =>
        [...document.querySelectorAll(".addon-ui-host")].map(host => {
            const root = host.shadowRoot;
            const use = root.querySelector('[data-testid="icon"] use');
            return {
                width: use.getBBox().width,
                symbol: !!root.querySelector("#sample"),
                late: root.querySelector('[data-testid="late-icon"] use')?.getBBox().width,
            };
        })
    );
    expect(svg.map(item => item.width)).toEqual([17, 9]);
    expect(svg.every(item => item.symbol)).toBe(true);
    expect(svg[0].late).toBeGreaterThan(0);
});
