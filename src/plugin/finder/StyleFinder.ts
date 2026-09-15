import type {ReadonlyConfig} from "adnbn";

import type {FileImportInfo} from "../types";

import Finder from "./Finder";

export default class StyleFinder extends Finder {
    protected getAllowedExtensions(): string[] {
        return ["scss", "css"];
    }

    constructor(fileName: string, config: ReadonlyConfig) {
        super(fileName, config);
    }

    protected getFile(dirPath: string): FileImportInfo | undefined {
        const filePath = this.resolveFileWithExtensions(dirPath, this.fileName);

        if (!filePath) {
            return;
        }

        return {import: this.toImportPath(filePath)};
    }
}
