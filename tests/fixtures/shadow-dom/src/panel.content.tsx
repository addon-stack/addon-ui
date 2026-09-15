import React from "react";

import {ContentScriptIsolation, type ContentScriptProps, defineContentScript} from "adnbn";

import App from "./shared/App";

export default defineContentScript({
    matches: ["http://127.0.0.1/*"],
    runAt: "document_end",
    anchor: ".ui-anchor",
    isolation: ContentScriptIsolation.Shadow,
    container: ({anchor}: ContentScriptProps) => {
        const host = document.createElement("aside");
        host.className = "addon-ui-host";

        Object.assign(host.style, {
            position: "fixed",
            top: "20px",
            left: anchor.id === "second" ? "390px" : "20px",
            zIndex: "2147483647",
        });

        return host;
    },
    render: () => <App shadow />,
});
