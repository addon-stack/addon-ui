import assert from "node:assert/strict";

import {withFirefoxClient} from "./firefox-addon.mjs";

// Playwright's Firefox JugglerFrameChild explicitly skips moz-extension://.
// Use Firefox's console actor for the real extension page, without changing its URL or APIs.
export async function checkFirefoxPopup(port) {
    return withFirefoxClient(port, async ({request, receive}) => {
        const poll = async (read, predicate, description) => {
            const deadline = Date.now() + 8000;

            do {
                const value = await read();

                if (predicate(value)) {
                    return value;
                }

                await new Promise(resolve => setTimeout(resolve, 50));
            } while (Date.now() < deadline);

            throw new Error(`Firefox popup: ${description}`);
        };

        const tab = await poll(
            async () =>
                (await request("root", "listTabs")).tabs.find(
                    tab => tab.url.startsWith("moz-extension://") && tab.url.endsWith("/popup.html")
                ),
            Boolean,
            "extension tab did not load"
        );

        const {frame} = await request(tab.actor, "getTarget");

        const evaluate = async fn => {
            const {resultID} = await request(frame.consoleActor, "evaluateJSAsync", {
                text: `JSON.stringify((${fn.toString()})())`,
            });

            const result = await receive(packet => packet.type === "evaluationResult" && packet.resultID === resultID);
            assert.equal(result.hasException, false, JSON.stringify(result));

            return result.result === undefined || typeof result.result === "object"
                ? undefined
                : JSON.parse(result.result);
        };

        await poll(
            () => evaluate(() => !!document.querySelector('[data-testid="panel"]')),
            Boolean,
            "UI did not render"
        );

        assert.deepEqual(
            await evaluate(() => ({
                theme: document.documentElement.getAttribute("theme"),
                fontSize: getComputedStyle(document.body).fontSize,
            })),
            {theme: "light", fontSize: "15px"}
        );

        await evaluate(() => {
            document.querySelector('[data-testid="open-modal"]').focus();
            document.querySelector('[data-testid="open-modal"]').click();
        });

        const active = () => evaluate(() => document.activeElement?.getAttribute("data-testid"));
        await poll(active, value => value === "first", "modal autofocus");

        await evaluate(() => {
            const last = document.querySelector('[data-testid="last"]');
            last.focus();

            last.dispatchEvent(
                new KeyboardEvent("keydown", {key: "Tab", code: "Tab", bubbles: true, cancelable: true})
            );
        });

        await poll(active, value => value === "first", "modal Tab cycle");

        await evaluate(() =>
            document.activeElement.dispatchEvent(
                new KeyboardEvent("keydown", {key: "Escape", code: "Escape", bubbles: true, cancelable: true})
            )
        );

        await poll(
            () => evaluate(() => !!document.querySelector('[data-testid="modal"]')),
            value => !value,
            "modal close animation"
        );

        await poll(active, value => value === "open-modal", "modal opener restoration");

        await evaluate(() => {
            const trigger = document.querySelector('[data-testid="select"]');
            trigger.focus();

            trigger.dispatchEvent(
                new KeyboardEvent("keydown", {key: "ArrowDown", code: "ArrowDown", bubbles: true, cancelable: true})
            );
        });

        await poll(() => evaluate(() => !!document.querySelector('[data-testid="options"]')), Boolean, "Select open");

        await evaluate(() =>
            document.activeElement.dispatchEvent(
                new KeyboardEvent("keydown", {key: "Escape", code: "Escape", bubbles: true, cancelable: true})
            )
        );

        await poll(active, value => value === "select", "Select trigger restoration");
        await evaluate(() => document.querySelector('[data-testid="lazy-open"]').click());

        await poll(
            () =>
                evaluate(() => {
                    const element = document.querySelector('[data-testid="lazy"]');

                    return element && getComputedStyle(element).borderTopWidth;
                }),
            value => value === "7px",
            "lazy component and CSS"
        );

        return {url: tab.url, interaction: "Firefox RDP DOM events", passed: true};
    });
}
