import {test, expect} from "../support/browser/fixtures.mjs";
import {checkFirefoxPopup} from "../support/browser/firefox-popup.mjs";

test("popup document retains styles, portals, focus and lazy imports", async ({host, extension, engine}, testInfo) => {
    if (engine === "firefox") {
        await host.getByTestId("popup-open").click();
        const result = await checkFirefoxPopup(extension.debugPort);
        await testInfo.attach("firefox-popup", {body: JSON.stringify(result), contentType: "application/json"});
        return;
    }
    const [popup] = await Promise.all([
        extension.context.waitForEvent("page", {timeout: 8000}),
        host.getByTestId("popup-open").click(),
    ]);
    popup.setDefaultTimeout(8000);
    await expect(popup.getByTestId("panel")).toBeVisible();
    await expect(popup.locator("html")).toHaveAttribute("theme", "light");
    await expect(popup.locator("body")).toHaveCSS("font-size", "15px");
    await popup.getByTestId("open-modal").click();
    await expect(popup.getByTestId("first")).toBeFocused();
    await popup.getByTestId("last").focus();
    await popup.keyboard.press("Tab");
    await expect(popup.getByTestId("first")).toBeFocused();
    await popup.keyboard.press("Escape");
    await expect(popup.getByTestId("modal")).toHaveCount(0);
    await expect(popup.getByTestId("open-modal")).toBeFocused();
    await popup.getByTestId("select").click();
    await expect(popup.getByTestId("options")).toBeVisible();
    await popup.keyboard.press("Escape");
    await expect(popup.getByTestId("select")).toBeFocused();
    await popup.getByTestId("lazy-open").click();
    await expect(popup.getByTestId("lazy")).toHaveCSS("border-top-width", "7px");
});
