import {expect, test} from "../support/browser/fixtures.mjs";

test("Select ignores unchanged resize and preserves normal closing", async ({page, host}) => {
    const trigger = host.getByTestId("select");
    const options = host.getByTestId("options");

    const open = async () => {
        await trigger.click();
        await expect(options).toBeVisible();
        await page.evaluate(() => window.dispatchEvent(new Event("resize")));
        await expect(options).toBeVisible();
    };

    for (const key of ["Enter", "Space", "Escape"]) {
        await open();
        await page.keyboard.press(key);
        await expect(options).toHaveCount(0);
        await expect(trigger).toHaveText("Beta");
    }

    await open();
    await options.getByRole("option", {name: "Delta", exact: true}).click();
    await expect(options).toHaveCount(0);
    await expect(trigger).toHaveText("Delta");
    await open();
    // Radix defers its outside-pointer listener. A locator click waits for layout
    // stability; a raw mouse click can arrive before that listener is installed.
    await page.locator("html").click({position: {x: 1000, y: 800}});
    await expect(options).toHaveCount(0);
    await open();
    await page.setViewportSize({width: 1000, height: 800});
    await expect(options).toHaveCount(0);
});

test("navigates, typeaheads and selects inside a modal across the shadow boundary", async ({page, host, active}) => {
    await host.getByTestId("open-modal").click();
    await expect.poll(active).toBe("first");
    await host.getByTestId("modal").getByTestId("select").click();
    await expect(host.getByTestId("options")).toBeVisible();

    expect(
        await host
            .getByTestId("modal")
            .locator("svg use")
            .evaluate(el => el.getBBox().width)
    ).toBe(17);

    await expect.poll(active).toBe("Beta");
    await page.keyboard.press("ArrowUp");
    await expect.poll(active).toBe("Alpha");
    await page.keyboard.press("End");
    await expect.poll(active).toBe("Delta");
    await page.keyboard.press("c");
    await expect.poll(active).toBe("Charlie");
    await page.keyboard.type("harlie a");
    await expect.poll(active).toBe("Charlie Alpha");
    await host.getByTestId("options").getByRole("option", {name: "Alpha", exact: true}).hover();
    await expect.poll(active).toBe("Alpha");
    await host.getByTestId("options").getByRole("option", {name: "Disabled", exact: true}).hover({force: true});
    await expect(host.getByTestId("options").locator("[data-highlighted]")).toHaveCount(0);
    await page.keyboard.press("Home");
    await expect.poll(active).toBe("Alpha");
    await page.keyboard.press("Enter");
    await expect(host.getByTestId("options")).toHaveCount(0);
    await expect.poll(active).toBe("select");
    await host.getByTestId("modal").getByTestId("select").click();
    await expect.poll(active).toBe("Alpha");
    await host.getByTestId("options").getByRole("option", {name: "Delta", exact: true}).click();
    await expect(host.getByTestId("options")).toHaveCount(0);
    await expect(host.getByTestId("modal").getByTestId("select")).toHaveText("Delta");
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("modal")).toHaveCount(0);
    await expect.poll(active).toBe("open-modal");
});
