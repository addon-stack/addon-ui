import React from "react";

import {type ContentScriptContainerProps, ContentScriptIsolation, defineContentScript} from "adnbn";

import App from "./App";

export default defineContentScript({
    matches: ["http://127.0.0.1/*"],
    runAt: "document_end",
    anchor: ".ui-anchor",
    isolation: ContentScriptIsolation.Shadow,
    container: ({anchor}: ContentScriptContainerProps) => {
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
    target: {tagName: "div", className: "addon-ui-target"},
    render: ({container, boundary}) => <App container={container} portal={boundary} />,
});
