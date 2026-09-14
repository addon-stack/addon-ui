import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createRequire} from "node:module";
import ts from "typescript";
import {buildDirectory} from "./paths.mjs";

export function verifyBuild(root, engine) {
    const fixture = createRequire(path.join(root, "package.json"));
    const framework = fs.realpathSync(path.join(root, "node_modules/adnbn"));
    assert.equal(fs.realpathSync(path.join(root, "node_modules/.bin/adnbn")), path.join(framework, "bin/adnbn.js"));
    assert.equal(fixture.resolve("adnbn"), path.join(framework, "dist/index.js"));
    const frameworkPackage = JSON.parse(fs.readFileSync(path.join(framework, "package.json")));
    const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json")));
    const locked = lock.packages["node_modules/adnbn"];
    assert.ok(
        !locked.link && locked.resolved?.startsWith("https://registry.npmjs.org/adnbn/"),
        "Framework must be installed from npm"
    );
    assert.equal(frameworkPackage.version, locked.version);
    const parsed = ts.getParsedCommandLineOfConfigFile(
        path.join(root, "tsconfig.json"),
        {},
        {
            ...ts.sys,
            onUnRecoverableConfigFileDiagnostic: d => {
                throw Error(d.messageText);
            },
        }
    );
    assert.equal(
        fs.realpathSync(
            ts.resolveModuleName("adnbn", path.join(root, "src/shared/App.tsx"), parsed.options, ts.sys).resolvedModule
                .resolvedFileName
        ),
        path.join(framework, "dist/index.d.ts")
    );
    const out = buildDirectory(root, engine);
    const manifest = JSON.parse(fs.readFileSync(path.join(out, "manifest.json")));
    const content = manifest.content_scripts[0];
    assert.equal(content.css?.length ?? 0, 0, "UI CSS must not be injected into the site");
    const war = manifest.web_accessible_resources.flatMap(entry => entry.resources ?? entry);
    const styles = war.filter(file => file.endsWith(".css"));
    assert.ok(styles.length >= 2, "Initial and lazy CSS must be web accessible");
    const css = styles.map(file => fs.readFileSync(path.join(out, file), "utf8"));
    assert.ok(
        css.some(
            text => text.includes("--font-family") && text.includes(":host") && text.includes("--integration-token")
        )
    );
    assert.ok(
        css.some(text => text.includes("7px solid")),
        "Lazy stylesheet is separate"
    );
    const popup = fs.readFileSync(path.join(out, "popup.html"), "utf8");
    assert.ok(
        styles.some(file => popup.includes(file)),
        "Popup must still link shared UI CSS"
    );
    const stats = JSON.parse(fs.readFileSync(path.join(root, `artifacts/stats-${path.basename(out)}.json`)));
    const modules = [];
    function visit(items = []) {
        for (const item of items) {
            if (item.identifier) modules.push(item);
            visit(item.modules);
        }
    }
    visit(stats.modules);
    assert.ok(
        modules.some(item => item.identifier.includes(framework + "/dist/entry/content")),
        "Uses the installed content runtime"
    );
    assert.ok(
        !modules.some(item => /addon-ui\/node_modules\/adnbn\//.test(item.identifier)),
        "All framework runtime modules must resolve to the fixture dependency"
    );
    assert.ok(
        modules.some(item => item.layer === "adnbn:css:isolation" && item.identifier.includes("adnbn-isolated-modules"))
    );
    return {
        frameworkVersion: frameworkPackage.version,
        contentCSS: content.css ?? [],
        isolatedCSS: styles,
        modules: modules.length,
    };
}
