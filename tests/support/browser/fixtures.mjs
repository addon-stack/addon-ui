import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import {chromium, expect, firefox, test as base} from "@playwright/test";

import {buildDirectory, fixtureRoot} from "../paths.mjs";

import {freeDebugPort, installFirefoxAddon} from "./firefox-addon.mjs";

export const test = base.extend({
    engine: ["chrome", {scope: "worker", option: true}],
    app: ["shadow-ui", {scope: "worker", option: true}],
    extension: [
        async ({engine, app, siteURL}, use) => {
            const root = fixtureRoot;
            const directory = buildDirectory(root, engine, app);
            const profile = await fs.mkdtemp(path.join(os.tmpdir(), "addon-ui-e2e-"));
            let context;

            try {
                const debugPort = engine === "firefox" ? await freeDebugPort() : undefined;

                const options = {
                    headless: true,
                    colorScheme: "light",
                    viewport: {width: 1100, height: 900},
                };

                context =
                    engine === "chrome"
                        ? await chromium.launchPersistentContext(profile, {
                            ...options,
                            executablePath: chromium.executablePath(),
                            args: [`--disable-extensions-except=${directory}`, `--load-extension=${directory}`],
                        })
                        : await firefox.launchPersistentContext(profile, {
                            ...options,
                            args: ["--start-debugger-server", String(debugPort)],
                            firefoxUserPrefs: {
                                "devtools.debugger.remote-enabled": true,
                                "devtools.debugger.prompt-connection": false,
                                "devtools.debugger.force-local": true,
                            },
                        });

                if (debugPort) {
                    await installFirefoxAddon(debugPort, directory);
                }

                // This dependency also closes the browser before shutting down its HTTP server.
                await use({context, debugPort, directory, siteURL});
            } finally {
                await context?.close();
                await fs.rm(profile, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
            }
        },
        {scope: "worker"},
    ],
    siteURL: [
        async ({}, use) => {
            const html = await fs.readFile(new URL("../../fixtures/sites/shadow-dom.html", import.meta.url), "utf8");

            const server = http.createServer((request, response) => {
                if (request.url === "/favicon.ico") {
                    response.writeHead(204);
                    response.end();

                    return;
                }

                response.setHeader("Content-Type", "text/html; charset=utf-8");
                response.end(html);
            });

            await new Promise((resolve, reject) => {
                server.once("error", reject);
                server.listen(0, "127.0.0.1", resolve);
            });

            try {
                await use(`http://127.0.0.1:${server.address().port}`);
            } finally {
                await new Promise((resolve, reject) => {
                    server.close(error => (error ? reject(error) : resolve()));
                    // Browsers can keep speculative connections open after the last test page closes.
                    server.closeAllConnections();
                });
            }
        },
        {scope: "worker"},
    ],
    _diagnostics: [
        async ({extension}, use, testInfo) => {
            const {context} = extension;
            const messages = [];
            const retainedPages = new Set(context.pages());
            const observed = new Map();

            const observe = page => {
                const onError = error => messages.push({type: "pageerror", message: error.message});

                const onConsole = message => {
                    if (message.type() === "error" || message.type() === "warning") {
                        messages.push({type: "console", message: message.text()});
                    }
                };

                page.on("pageerror", onError);
                page.on("console", onConsole);

                observed.set(page, () => {
                    page.off("pageerror", onError);
                    page.off("console", onConsole);
                });
            };

            context.on("page", observe);

            for (const page of context.pages()) {
                observe(page);
            }

            await context.tracing.start({screenshots: true, snapshots: true, sources: true});
            let runtimeFailed = false;

            try {
                await use();

                runtimeFailed = messages.length > 0;
                expect(messages, "Unexpected extension runtime errors or warnings").toEqual([]);
            } finally {
                const failed = runtimeFailed || testInfo.status !== testInfo.expectedStatus;

                if (failed) {
                    for (const [index, page] of context.pages().entries()) {
                        if (!page.isClosed()) {
                            const screenshot = await page.screenshot().catch(() => undefined);

                            if (screenshot) {
                                await testInfo.attach(`failure-${index}`, {body: screenshot, contentType: "image/png"});
                            }
                        }
                    }

                    const trace = testInfo.outputPath("trace.zip");
                    await context.tracing.stop({path: trace});
                    await testInfo.attach("trace", {path: trace, contentType: "application/zip"});
                } else {
                    await context.tracing.stop();
                }

                await testInfo.attach("runtime", {
                    body: JSON.stringify({browser: context.browser()?.version(), messages}, null, 2),
                    contentType: "application/json",
                });

                context.off("page", observe);

                for (const dispose of observed.values()) {
                    dispose();
                }

                // Keep the initial tab alive so Firefox does not close its last window between tests.
                for (const page of context.pages()) {
                    if (!retainedPages.has(page)) {
                        await page.close();
                    }
                }
            }
        },
        {auto: true},
    ],
    page: async ({extension}, use) => {
        const page = await extension.context.newPage();
        page.setDefaultTimeout(8000);
        await page.goto(extension.siteURL);
        await use(page);
        // Diagnostics owns teardown so a failed page remains available for its screenshot.
    },
    host: async ({page}, use) => {
        const host = page.locator(".addon-ui-host").first();
        await expect(host.getByTestId("panel")).toBeVisible();
        await expect(page.locator(".addon-ui-host")).toHaveCount(2);
        await use(host);
    },
    active: async ({page}, use) => {
        await use(() =>
            page.evaluate(() => {
                let element = document.activeElement;

                while (element?.shadowRoot?.activeElement) {
                    element = element.shadowRoot.activeElement;
                }

                return element?.getAttribute("data-testid") ?? element?.textContent;
            })
        );
    },
});

export {expect};
