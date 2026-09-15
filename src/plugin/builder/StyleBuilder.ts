import fs from "fs";

import type {Finder} from "../finder";
import {mergeStyleSources} from "../styles";
import type {BuilderContract} from "../types";

export default class StyleBuilder implements BuilderContract {
    public constructor(protected finder: Finder) {}

    public build(): string {
        return mergeStyleSources(this.finder.getFiles().reverse().map(file => ({
            filename: file.import,
            content: fs.readFileSync(file.import, "utf8"),
        })));
    }
}
