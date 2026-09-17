import {defineBackground} from "adnbn";

export default defineBackground({
    main() {
        chrome.runtime.onMessage.addListener((message, _sender, respond) => {
            if (message?.type === "integration:open-popup") {
                const url = chrome.runtime.getURL("popup.html");

                // Firefox's extension tabs are outside Playwright's page lifecycle.
                // Close the previous case before acknowledging the new popup.
                chrome.tabs.query({url}, async tabs => {
                    const ids = tabs.flatMap(tab => tab.id === undefined ? [] : [tab.id]);

                    if (ids.length) {
                        await chrome.tabs.remove(ids);
                    }

                    chrome.tabs.create({url}, () => respond({opened: true}));
                });

                return true;
            }
        });
    },
});
