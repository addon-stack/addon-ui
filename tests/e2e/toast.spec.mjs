import {expect, test} from "../support/browser/fixtures.mjs";

test("Toast: enters through both focus proxies and pauses the close timer while focused", async ({
    page,
    host,
    active,
}) => {
    // Native entry through both proxy spans, then notification order and focus pause.
    await host.getByTestId("toast-open").click();
    await expect(host.getByTestId("toast")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect.poll(active).toBe("toast");
    await host.getByTestId("lazy-open").focus();
    await page.keyboard.press("Shift+Tab");
    await expect(host.getByTestId("toast").getByRole("button", {name: "Close"})).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect.poll(active).toBe("toast-action");
    await host.getByTestId("toast-action").hover();
    await page.mouse.move(1000, 750);
    // Exceed the fixture's 1500ms duration to prove focus pauses the real timer.
    await page.waitForTimeout(1700);
    await expect(host.getByTestId("toast")).toBeVisible();
    await host.getByTestId("theme").focus();
    await expect(host.getByTestId("toast")).toHaveCount(0, {timeout: 4000});
    await expect(host.getByTestId("theme")).toBeFocused();
});

test("Toast: restores viewport focus for Escape, button, code, forceMount and swipe", async ({page, host, active}) => {
    await host.getByTestId("toast-open").click();
    await page.keyboard.press("F8");
    await expect(host.locator('ol[tabindex="-1"]')).toBeFocused();
    await page.keyboard.press("Tab");
    await expect.poll(active).toBe("toast");
    await page.keyboard.press("Tab");
    await expect.poll(active).toBe("toast-action");
    await page.keyboard.press("Shift+Tab");
    await expect.poll(active).toBe("toast");
    await page.keyboard.press("Tab");
    await expect.poll(active).toBe("toast-action");
    await host.getByTestId("toast").evaluate(el => el.style.setProperty("--toast-speed-animation", "400ms"));
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("toast")).toHaveAttribute("data-state", "closed");
    await expect(host.getByTestId("toast")).toHaveCount(0);
    const toastViewport = host.locator('ol[tabindex="-1"]');
    await expect(toastViewport).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(host.getByTestId("lazy-open")).toBeFocused();
    expect(await toastViewport.evaluate(el => getComputedStyle(el).position)).toBe("fixed");
    await host.getByTestId("toast-open").click();
    await host.getByTestId("toast").getByRole("button", {name: "Close"}).click();
    await expect(host.getByTestId("toast")).toHaveCount(0);
    await expect(toastViewport).toBeFocused();
    await host.getByTestId("toast-open").click();
    await host.getByTestId("toast-action").focus();
    await host.getByTestId("toast-code-close").evaluate(el => el.click());
    await expect(host.getByTestId("toast")).toHaveCount(0);
    await expect(toastViewport).toBeFocused();
    // A retained closed Root still restores focus, including when CSS hides it.
    await host.getByTestId("toast-force").click();
    await host.getByTestId("toast-open").click();
    await host.getByTestId("toast-action").focus();
    await host.getByTestId("toast-code-close").evaluate(el => el.click());
    await expect(host.getByTestId("toast")).toHaveAttribute("data-state", "closed");
    await expect(host.getByTestId("toast")).toBeHidden();
    await expect(toastViewport).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(host.getByTestId("lazy-open")).toBeFocused();
    await host.getByTestId("toast-force").click();
    await expect(host.getByTestId("toast")).toHaveCount(0);
    // Native swipe uses Radix's separate closing path.
    await host.getByTestId("toast-open").click();
    await host.getByTestId("toast-action").hover();
    await host.getByTestId("toast-action").focus();
    const toastBox = await host.getByTestId("toast").boundingBox();
    await page.mouse.move(toastBox.x + 12, toastBox.y + 8);
    await page.mouse.down();
    await page.mouse.move(toastBox.x + 160, toastBox.y + 8, {steps: 8});
    await page.mouse.up();
    await expect(host.getByTestId("toast")).toHaveCount(0);
    await expect(toastViewport).toBeFocused();
    await host.getByTestId("toast-open").click();
    await host.getByTestId("toast-action").focus();
    await host.getByTestId("toast-remove").evaluate(el => el.click());
    await expect(toastViewport).toHaveCount(0);
    await host.getByTestId("toast-remove").click();
});
