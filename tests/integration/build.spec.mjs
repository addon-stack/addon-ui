import {execFile} from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import {promisify} from "node:util";
import {expect, test} from "@playwright/test";

import {buildDirectory, fixtureRoot} from "../support/paths.mjs";
import {verifyBuild} from "../support/verify-build.mjs";

const execute = promisify(execFile);

// Both browser builds use each fixture's virtual-module directory. Keep them sequential.
for (const engine of ["chrome", "firefox"]) {
    const root = fixtureRoot;

    test(`${engine}: extension build, CSS delivery and declarations`, async ({}, testInfo) => {
        test.setTimeout(120_000);
        let build;

        try {
            build = await execute(
                process.execPath,
                [path.join(root, "node_modules/adnbn/bin/adnbn.js"), "build", "-b", engine],
                {
                    cwd: root,
                    timeout: 90_000,
                    maxBuffer: 8 * 1024 * 1024,
                }
            );
        } catch (error) {
            await testInfo.attach("build.log", {
                body: String(error.stdout ?? "") + String(error.stderr ?? ""),
                contentType: "text/plain",
            });

            throw error;
        }

        await testInfo.attach("build.log", {body: build.stdout + build.stderr, contentType: "text/plain"});

        const manifest = JSON.parse(
            await fs.readFile(path.join(buildDirectory(root, engine), "manifest.json"), "utf8")
        );

        expect(manifest.content_scripts[0].css ?? []).toEqual([]);
        expect(manifest.action.default_popup).toBe("popup.html");

        await testInfo.attach("build-verification", {
            body: JSON.stringify(verifyBuild(root, engine)),
            contentType: "application/json",
        });

        // Declarations are independent of the browser target: check once per fixture.
        if (engine === "chrome") {
            const result = await execute(
                process.execPath,
                [path.join(root, "node_modules/typescript/bin/tsc"), "--noEmit"],
                {cwd: root, timeout: 60_000}
            );

            expect(result.stderr).toBe("");
        }
    });
}
