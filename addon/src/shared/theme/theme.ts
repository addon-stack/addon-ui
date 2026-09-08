import {defineConfig} from "addon-ui/config";

import CloseIcon from "./icons/close.svg?react";
import HelpIcon from "./icons/help.svg?react";

export default defineConfig({
    icons: {
        close: CloseIcon,
        help: HelpIcon,
    },
});
