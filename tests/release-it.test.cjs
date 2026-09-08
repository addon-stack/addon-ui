const {execFileSync} = require("node:child_process");
const path = require("node:path");
const {whatBump} = require("../.release-it.cjs");

describe("release-it version policy", () => {
    describe("breaking changes", () => {
        test.each([
            ["parser breaking field", {type: "feat", breaking: "!"}],
            ["type suffix", {type: "feat!"}],
            ["header suffix", {type: "feat", header: "feat(ui)!: remove legacy API"}],
            ["BREAKING CHANGE note", {type: "fix", notes: [{title: "BREAKING CHANGE", text: "new contract"}]}],
            ["BREAKING-CHANGE footer", {type: "fix", footer: "BREAKING-CHANGE: new contract"}],
        ])("treats %s as a pre-1.0 minor bump", (_label, commit) => {
            expect(whatBump([commit], "0.11.0")).toEqual({level: 1});
        });

        test("becomes a major bump after 1.0", () => {
            expect(
                whatBump([{type: "fix", notes: [{title: "BREAKING CHANGE", text: "new contract"}]}], "1.4.2")
            ).toEqual({level: 0});
        });

        test("takes precedence over lower-level changes after 1.0", () => {
            expect(whatBump([{type: "fix"}, {type: "feat"}, {type: "refactor", breaking: true}], "2.0.0")).toEqual({
                level: 0,
            });
        });
    });

    test("uses a minor bump for feat", () => {
        const type = "feat";

        expect(whatBump([{type}], "0.11.0")).toEqual({level: 1});
    });

    test.each(["fix", "perf", "refactor", "ci"])("uses a patch bump for %s", type => {
        expect(whatBump([{type}], "0.11.0")).toEqual({level: 2});
    });

    test("uses the highest non-breaking bump", () => {
        expect(whatBump([{type: "fix"}, {type: "feat"}], "0.11.0")).toEqual({level: 1});
    });

    test.each(["docs", "test", "chore", "build"])("does not release for %s alone", type => {
        expect(whatBump([{type}], "0.11.0")).toBeNull();
    });
});

describe("release-it parsed commits", () => {
    const renderRelease = (message, currentVersion) =>
        // Use the installed ESM parser, bumper, and writer without running a release.
        JSON.parse(
            execFileSync(
                process.execPath,
                [
                    "--input-type=module",
                    "-e",
                    `
                        import {readFileSync} from "node:fs";
                        import {CommitParser} from "conventional-commits-parser";
                        import {loadPreset} from "conventional-changelog-preset-loader";
                        import {Bumper} from "conventional-recommended-bump";
                        import {writeChangelogString} from "conventional-changelog-writer";
                        import semver from "semver";
                        import createReleaseConfig from "./.release-it.cjs";

                        const {message, currentVersion} = JSON.parse(readFileSync(0, "utf8"));
                        const pkg = JSON.parse(readFileSync("package.json", "utf8"));
                        const options = createReleaseConfig().plugins["@release-it/conventional-changelog"];
                        const preset = await loadPreset(options.preset);
                        const commit = new CommitParser({...preset.parser, ...options.parserOpts}).parse(message);
                        const {releaseType} = await new Bumper().commits([commit]).bump(
                            currentVersion ? commits => options.whatBump(commits, currentVersion) : options.whatBump
                        );
                        const version = semver.inc(currentVersion || pkg.version, releaseType);
                        const notes = await writeChangelogString([commit], {
                            ...options.context, contributors: [], version,
                        }, {...preset.writer, ...options.writerOpts});
                        process.stdout.write(JSON.stringify({version, subject: commit.subject, notes}));
                    `,
                ],
                {
                    cwd: path.resolve(__dirname, ".."),
                    encoding: "utf8",
                    input: JSON.stringify({message, currentVersion}),
                    timeout: 10_000,
                }
            )
        );

    test.each([
        "refactor!: remove legacy API",
        "fix(ui)!: remove legacy API",
        "fix(ui): remove legacy API\n\nBREAKING CHANGE: remove legacy API",
        "fix(ui): remove legacy API\n\nBREAKING-CHANGE: remove legacy API",
    ])("keeps %s in 0.x and preserves its description", message => {
        const release = renderRelease(message, "0.11.1");

        expect(release.version).toBe("0.12.0");
        expect(release.subject).toBe("remove legacy API");
        expect(release.notes).toContain("### 💥 Breaking Changes");
        expect(release.notes).toContain("* remove legacy API");
    });

    test("uses the package version when the bumper calls whatBump without a version", () => {
        const semver = require("semver");
        const {version} = require("../package.json");
        const expected = semver.inc(version, semver.major(version) === 0 ? "minor" : "major");

        expect(renderRelease("refactor!: remove legacy API").version).toBe(expected);
    });

    test.each([
        ["0.0.1", "0.1.0"],
        ["0.99.9", "0.100.0"],
        ["1.4.2", "2.0.0"],
    ])("bumps a breaking change from %s to %s", (currentVersion, expectedVersion) => {
        expect(renderRelease("feat!: remove legacy API", currentVersion).version).toBe(expectedVersion);
    });

    test("keeps an ordinary fix as a patch", () => {
        const release = renderRelease("fix(ui): correct button state", "0.11.1");

        expect(release.version).toBe("0.11.2");
        expect(release.notes).not.toContain("### 💥 Breaking Changes");
    });
});
