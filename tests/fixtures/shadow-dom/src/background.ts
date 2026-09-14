import {defineBackground} from "adnbn";

export default defineBackground({
    main() {
        chrome.runtime.onMessage.addListener((message, _sender, respond) => {
            if (message?.type === "integration:open-popup") {
                chrome.tabs.create({url: chrome.runtime.getURL("popup.html")}, () => respond({opened: true}));
                return true;
            }
        });
    },
});
