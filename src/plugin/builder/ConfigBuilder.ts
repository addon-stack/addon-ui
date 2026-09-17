import {createRequire} from "node:module";

import type {Finder} from "../finder";
import type {BuilderContract} from "../types";

export default class ConfigBuilder implements BuilderContract {
    public constructor(protected finder: Finder) {}

    public build(): string {
        const files = this.finder.getFiles().reverse();
        const imports = files.map((file, index) => `import config${index} from ${JSON.stringify(file.import)};`);
        const configs = ["{components: {}, extra: {}, icons: {}}", ...files.map((_, index) => `config${index}`)];

        return [
            `import {merge} from ${JSON.stringify(createRequire(import.meta.url).resolve("ts-deepmerge"))};`,
            ...imports,
            `const configs = [${configs.join(", ")}];`,
            "const settings = configs.map(({icons, ...settings}) => settings);",
            "export default {...merge(...settings), icons: Object.assign({}, ...configs.map(config => config.icons))};",
        ].join("\n");
    }
}
