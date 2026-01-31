import {Storage, StorageProvider} from "@addon-core/storage";

import {Theme, ThemeStorageContract} from "../../types/theme";

export type ThemeStorageState = Record<string, Theme>;

export default class implements ThemeStorageContract {
    protected storage: StorageProvider<ThemeStorageState> = new Storage<ThemeStorageState>({
        area: "local",
        namespace: "addon-ui",
    });

    protected key: string = "theme";

    constructor(storage?: StorageProvider<ThemeStorageState>, key?: string) {
        this.storage = storage ? storage : this.storage;
        this.key = key ? key : this.key;
    }

    public async get(): Promise<Theme | undefined> {
        return await this.storage.get(this.key);
    }

    public async change(theme: Theme): Promise<void> {
        return this.storage.set(this.key, theme);
    }

    public async toggle(): Promise<void> {
        let theme = await this.get();

        if (!theme) {
            theme = Theme.Dark;
        }

        await this.change(theme === Theme.Dark ? Theme.Light : Theme.Dark);
    }

    public watch(callback: (theme: Theme) => void): () => void {
        return this.storage.watch({
            [this.key]: newValue => newValue && callback(newValue),
        });
    }
}
