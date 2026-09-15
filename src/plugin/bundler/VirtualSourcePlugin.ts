import {existsSync} from "node:fs";
import path from "node:path";
import type {Compiler} from "@rspack/core";

import {getVirtualSourcePath} from "./get-virtual-source-path";

export interface VirtualSourceDependencies {
    files?: Iterable<string>;
    directories?: Iterable<string>;
}

export interface VirtualSourceOptions {
    modules: readonly string[];
    generate: () => Record<string, string> | Promise<Record<string, string>>;
    dependencies: () => VirtualSourceDependencies;
}

/** Fixed import names backed by compiler-local sources, refreshed before each compilation. */
export default class VirtualSourcePlugin {
    public constructor(private readonly options: VirtualSourceOptions) {}

    public apply(compiler: Compiler): void {
        const name = "VirtualSourcePlugin";

        const resources = Object.fromEntries(this.options.modules.map(module => [
            module,
            getVirtualSourcePath(compiler.context, module),
        ]));

        const virtual = new compiler.webpack.experiments.VirtualModulesPlugin(
            Object.fromEntries(Object.values(resources).map(file => [file, ""]))
        );

        virtual.apply(compiler);

        compiler.options.resolve.alias = {
            ...compiler.options.resolve.alias,
            ...Object.fromEntries(Object.entries(resources).map(([module, file]) => [`${module}$`, file])),
        };

        const sources = new Map<string, string>();
        const pending = new Map<string, string>();

        let initialized = false;
        let failure: Error | undefined;
        let dependencies: VirtualSourceDependencies = {};

        const refresh = async () => {
            failure = undefined;

            try {
                // Keep dependencies even when source generation fails, so edits can repair the build.
                dependencies = this.options.dependencies();
                const next = await this.options.generate();

                if (Object.keys(next).length !== this.options.modules.length ||
                    this.options.modules.some(module => typeof next[module] !== "string")) {
                    throw new Error("Virtual sources must return every registered module, including empty fallbacks");
                }

                for (const [module, source] of Object.entries(next)) {
                    if (sources.get(module) === source) {
                        continue;
                    }

                    const file = resources[module];

                    if (initialized) {
                        virtual.writeModule(file, source);
                        compiler.modifiedFiles = new Set([...(compiler.modifiedFiles ?? []), file]);
                    } else {
                        pending.set(file, source);
                    }

                    sources.set(module, source);
                }
            } catch (error) {
                failure = error instanceof Error ? error : new Error(String(error));
            }
        };

        compiler.hooks.beforeRun.tapPromise(name, refresh);
        compiler.hooks.watchRun.tapPromise(name, refresh);

        compiler.hooks.compilation.tap(name, compilation => {
            for (const [file, source] of pending) {
                virtual.writeModule(file, source);
            }

            pending.clear();
            initialized = true;

            for (const file of dependencies.files ?? []) {
                compilation.fileDependencies.add(path.resolve(compiler.context, file));
            }

            for (const directory of dependencies.directories ?? []) {
                const absolute = path.resolve(compiler.context, directory);
                const target = existsSync(absolute) ? compilation.contextDependencies : compilation.missingDependencies;
                target.add(absolute);
            }

            if (failure) {
                compilation.errors.push(failure);
            }
        });
    }
}
