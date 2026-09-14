import {test, expect} from "../support/browser/fixtures.mjs";

test("traps modal focus and yields to nested Popover and Modal", async ({page, host, active}) => {
    await host.getByTestId("open-modal").click();
    await expect.poll(active).toBe("first");
    await host.getByTestId("last").focus();
    await page.keyboard.press("Tab");
    await expect.poll(active).toBe("first");
    await page.keyboard.press("Shift+Tab");
    await expect.poll(active).toBe("last");
    await page.locator("#outside").evaluate(el => el.focus());
    await expect.poll(active).toBe("last");
    await host.getByTestId("modal").getByTestId("popover").click();
    await expect(host.getByTestId("popover-content")).toBeVisible();
    await expect.poll(active).toBe("popover-first");
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("popover-content")).toHaveCount(0);
    await host.getByTestId("nested").click();
    await expect.poll(active).toBe("nested-first");
    await host.getByTestId("nested-close").click();
    await expect(host.getByTestId("nested-modal")).toHaveCount(0);
    await expect.poll(active).toBe("nested");
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("modal")).toHaveCount(0);
    await expect.poll(active).toBe("open-modal");
});

test("scrolls modal contents, preserves callbacks and touch defaults", async ({
    page,
    host,
    active,
    engine,
    extension,
}) => {
    await host.getByTestId("open-modal").click();
    await expect.poll(active).toBe("first");
    await host.getByTestId("scroll").hover();
    await page.mouse.wheel(0, 350);
    await expect.poll(() => host.getByTestId("scroll").evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    expect(Number(await host.getByTestId("modal").getAttribute("data-wheels"))).toBeGreaterThan(0);
    const touch = await host.getByTestId("scroll").evaluate(element => {
        let reachedDocument = false;
        const listener = () => {
            reachedDocument = true;
        };
        element.ownerDocument.addEventListener("touchmove", listener);
        const event = new Event("touchmove", {bubbles: true, composed: true, cancelable: true});
        element.dispatchEvent(event);
        element.ownerDocument.removeEventListener("touchmove", listener);
        return {reachedDocument, defaultPrevented: event.defaultPrevented};
    });
    expect(touch).toEqual({reachedDocument: false, defaultPrevented: false});
    expect(Number(await host.getByTestId("modal").getAttribute("data-touches"))).toBeGreaterThan(0);
    if (engine === "chrome") {
        const cdp = await extension.context.newCDPSession(page);
        const box = await host.getByTestId("scroll").boundingBox();
        const before = await host.getByTestId("scroll").evaluate(element => element.scrollTop);
        await cdp.send("Emulation.setTouchEmulationEnabled", {enabled: true, maxTouchPoints: 1});
        await cdp.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [{x: box.x + box.width / 2, y: box.y + 130, id: 1}],
        });
        for (const dy of [100, 70, 40, 20])
            await cdp.send("Input.dispatchTouchEvent", {
                type: "touchMove",
                touchPoints: [{x: box.x + box.width / 2, y: box.y + dy, id: 1}],
            });
        await cdp.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
        await expect
            .poll(() => host.getByTestId("scroll").evaluate(element => element.scrollTop))
            .toBeGreaterThan(before);
        await cdp.send("Emulation.setTouchEmulationEnabled", {enabled: false});
        await cdp.detach();
    }
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("modal")).toHaveCount(0);
    await expect.poll(active).toBe("open-modal");
});

test("locks the website while scrolling a Drawer and restores focus", async ({page, host, active}) => {
    // Scroll lock and restoration on the second dialog composition.
    await host.getByTestId("open-drawer").click();
    await expect.poll(active).toBe("drawer-first");
    await host.getByTestId("drawer-scroll").hover();
    await page.mouse.wheel(0, 300);
    await expect.poll(() => host.getByTestId("drawer-scroll").evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    const locked = await page.evaluate(() => ({
        lock: document.body.hasAttribute("data-scroll-locked"),
        top: window.scrollY,
    }));
    expect(locked.lock).toBe(true);
    await page.mouse.move(1050, 700);
    await page.mouse.wheel(0, 300);
    expect(await page.evaluate(() => window.scrollY)).toBe(locked.top);
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("drawer")).toHaveCount(0);
    await expect.poll(active).toBe("open-drawer");
    await expect.poll(() => page.evaluate(() => document.body.hasAttribute("data-scroll-locked"))).toBe(false);
});

test("retains focus when active controls and all tab stops are removed", async ({page, host, active}) => {
    // Remove the focused element and all tab stops while the modal remains open.
    await host.getByTestId("open-modal").click();
    await host.getByTestId("first").click();
    await expect.poll(active).toBe("modal");
    await page.keyboard.press("Tab");
    await expect.poll(active).toBe("modal");
    await page.keyboard.press("Shift+Tab");
    await expect.poll(active).toBe("modal");
    await page.keyboard.press("Escape");
    await expect(host.getByTestId("modal")).toHaveCount(0);
    await expect.poll(active).toBe("open-modal");
});
