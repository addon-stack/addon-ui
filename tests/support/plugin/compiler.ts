import {readFileSync} from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {type Compiler, type Configuration, CssExtractRspackPlugin, rspack, type Stats} from "@rspack/core";

export const createCompiler = (
    root: string, plugins: Configuration["plugins"] = [], output = "dist"
): Compiler => rspack({
    context: root,
    mode: "development",
    target: "node",
    entry: "./entry.ts",
    devtool: false,
    output: {path: path.join(root, output), filename: "main.cjs", library: {type: "commonjs2"}},
    resolve: {extensions: [".ts", ".tsx", ".js"], modules: [path.resolve("node_modules"), "node_modules"]},
    resolveLoader: {modules: [path.resolve("node_modules")]},
    module: {rules: [
        {test: /\.tsx?$/, use: {loader: "builtin:swc-loader", options: {jsc: {parser: {syntax: "typescript"}}}}},
        {test: /\.s?css$/, use: [CssExtractRspackPlugin.loader, "css-loader", "sass-loader"]},
        {test: /\.svg$/, type: "asset/resource"},
    ]},
    optimization: {minimize: false},
    plugins: [new CssExtractRspackPlugin({filename: "main.css"}), ...plugins ?? []],
})!;

export const readResult = (compiler: Compiler): {config: any; css: string} => {
    const output = compiler.options.output.path!;
    const module = {exports: {} as any};
    vm.runInNewContext(readFileSync(path.join(output, "main.cjs"), "utf8"), {module, exports: module.exports, require});
    let css = "";

    try {
        css = readFileSync(path.join(output, "main.css"), "utf8");
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
        }
    }

    return {config: module.exports.default, css};
};

export const closeCompiler = (compiler: Compiler): Promise<void> => new Promise((resolve, reject) => {
    compiler.close(error => error ? reject(error) : resolve());
});

export const build = async (compiler: Compiler): Promise<Stats> => {
    try {
        return await new Promise<Stats>((resolve, reject) => {
            compiler.run((error, stats) => error ? reject(error) : resolve(stats!));
        });
    } finally {
        await closeCompiler(compiler);
    }
};

export const watch = (compiler: Compiler) => {
    type Result = {stats: Stats; value?: ReturnType<typeof readResult>};
    const history: Result[] = [];
    const listeners = new Set<() => void>();
    let failure: Error | undefined;

    const watching = compiler.watch({aggregateTimeout: 30, poll: 100}, (error, stats) => {
        failure = error ?? undefined;

        if (stats) {
            history.push({stats, value: stats.hasErrors() ? undefined : readResult(compiler)});
        }

        // Let Rspack re-arm filesystem observation after delivering its result.
        setImmediate(() => listeners.forEach(listener => listener()));
    });

    return {
        next: (predicate: (result: Result) => boolean) => {
            const start = history.length;

            return new Promise<Result>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    listeners.delete(check);
                    reject(new Error(`Watch did not produce the expected build: ${history.at(-1)?.stats.toString()}`));
                }, 15_000);

                const check = () => {
                    const result = history.slice(start).find(predicate);

                    if (failure || result) {
                        clearTimeout(timeout);
                        listeners.delete(check);

                        if (failure) {
                            reject(failure);
                        } else {
                            resolve(result!);
                        }
                    }
                };

                listeners.add(check);
            });
        },
        close: () => new Promise<void>(resolve => {
            watching.close(resolve);
        }).then(() => closeCompiler(compiler)),
    };
};
