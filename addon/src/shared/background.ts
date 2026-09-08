import {defineBackground, getPageUrl} from "adnbn"
import {createTab} from "adnbn/browser";

export default defineBackground({
    async main(){
        await createTab({url: getPageUrl('components'), active: true});
    }
});