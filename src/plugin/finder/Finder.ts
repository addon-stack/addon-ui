import type {ReadonlyConfig} from "adnbn";
import fs from "fs";
import path from "path";

import type {FileImportInfo} from "../types";

export interface FinderOptions {
    searchDirs: string[];
    fileName: string;
    canMerge: boolean;
}

export default abstract class Finder {
    protected abstract getAllowedExtensions(): string[];

    protected abstract getFile(dirPath: string): FileImportInfo | undefined;

    protected searchDirs: string[] = [];
    protected canMerge: boolean = true;

    protected constructor(
        protected readonly fileName: string,
        protected readonly config: ReadonlyConfig
    ) {}

    public setCanMerge(canMerge: boolean): this {
        this.canMerge = canMerge;

        return this;
    }

    public setSearchDirs(searchDirs: string[]): this {
        this.searchDirs = [...new Set(searchDirs.map(dir => path.resolve(this.config.rootDir, dir)))];

        return this;
    }

    public getFiles(): FileImportInfo[] {
        const files: FileImportInfo[] = [];

        for (const dirPath of this.searchDirs) {
            const file = this.getFile(dirPath);

            if (file) {
                files.push(file);

                if (!this.canMerge) {
                    break;
                }
            }
        }

        return files;
    }

    protected resolveFileWithExtensions(basePath: string, fileName: string): string | undefined {
        const extensions = this.getAllowedExtensions();

        // Names such as "ui.config" are basenames; a supported extension selects one exact file.
        const candidates = extensions.includes(path.extname(fileName).slice(1))
            ? [fileName]
            : extensions.map(extension => `${fileName}.${extension}`);

        for (const candidate of candidates) {
            const fullPath = path.resolve(basePath, candidate);

            try {
                if (fs.statSync(fullPath).isFile()) {
                    return fullPath;
                }
            } catch (error) {
                const {code} = error as NodeJS.ErrnoException;

                if (code !== "ENOENT" && code !== "ENOTDIR") {
                    throw error;
                }
            }
        }

        return undefined;
    }

    public getDirectories(): readonly string[] {
        return this.searchDirs;
    }

    protected toImportPath(fullPath: string): string {
        return fullPath.split(path.sep).join("/");
    }
}
