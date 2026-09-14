import {test, expect} from "../support/browser/fixtures.mjs";

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
