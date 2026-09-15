import {createRequire} from "node:module";
import type {Compiler, RuleSetRule, RuleSetUseItem} from "@rspack/core";

import {getVirtualSourcePath} from "./get-virtual-source-path";

/** Restore partial-relative assets after Sass, using its source maps. */
export default class StyleResourcesPlugin {
    public constructor(private readonly module: string) {}

    public apply(compiler: Compiler): void {
        const resource = getVirtualSourcePath(compiler.context, this.module);
        const loader = createRequire(import.meta.url).resolve("resolve-url-loader");
        let nextRule = 0;

        const patchUse = (item: RuleSetUseItem, ident: string): RuleSetUseItem[] => {
            const entry = typeof item === "string" ? {loader: item} : item;

            if (!/(?:^|[/\\])sass-loader(?:[/\\]|$)/.test(entry.loader)) {
                return [item];
            }

            if (typeof entry.options === "string") {
                throw new Error("Virtual stylesheet Sass options must be an object");
            }

            return [
                {loader, options: {sourceMap: Boolean(compiler.options.devtool)}},
                {...entry, ident,
                    options: {...entry.options, sourceMap: true}},
            ];
        };

        const patchRule = (rule: RuleSetRule): RuleSetRule => {
            const ruleId = nextRule++;
            const {loader: originalLoader, options, use, ...rest} = rule;
            const original = use ?? (originalLoader ? {loader: originalLoader, options} : undefined);

            return {
                ...rest,
                ...(rule.oneOf && {oneOf: rule.oneOf.map(child => child && patchRule(child))}),
                ...(rule.rules && {rules: rule.rules.map(child => child && patchRule(child))}),
                ...(original && {use: data => {
                    const entries = typeof original === "function" ? original(data) : original;
                    const items = Array.isArray(entries) ? entries : [entries];

                    return data.resource?.split("?")[0] === resource
                        ? items.flatMap((item, index) => patchUse(item, `virtual-style-${ruleId}-${index}`))
                        : items;
                }}),
            };
        };

        compiler.options.module.rules = compiler.options.module.rules.map(rule =>
            rule && rule !== "..." ? patchRule(rule) : rule
        );
    }
}
