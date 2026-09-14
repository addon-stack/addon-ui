module.exports = {
    maxWorkers: 2,
    projects: [
        {
            displayName: "unit",
            testEnvironment: "node",
            testMatch: ["<rootDir>/tests/unit/**/*.test.cjs"],
        },
        {
            displayName: "components",
            testEnvironment: "jsdom",
            coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/tests/"],
            testMatch: ["<rootDir>/tests/components/**/*.test.tsx"],
            setupFilesAfterEnv: ["<rootDir>/tests/support/components/setup.ts"],
            transform: {
                "^.+\\.tsx?$": [
                    "@swc/jest",
                    {
                        jsc: {parser: {syntax: "typescript", tsx: true}, transform: {react: {runtime: "automatic"}}},
                    },
                ],
            },
            moduleNameMapper: {
                "\\.(css|scss)(\\?isolation)?$": "<rootDir>/tests/support/components/style.cjs",
                "^addon-ui-config$": "<rootDir>/src/config/default.ts",
                "^@addon-core/storage$": "<rootDir>/tests/support/components/storage.cjs",
                "^adnbn$": "<rootDir>/tests/support/components/adnbn.cjs",
                "^adnbn/locale/react$": "<rootDir>/tests/support/components/locale.cjs",
                "^adnbn/locale$": "<rootDir>/tests/support/components/locale.cjs",
            },
        },
    ],
};
