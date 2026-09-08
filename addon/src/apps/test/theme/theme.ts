import {defineConfig} from "addon-ui/config";
import {ButtonRadius, ButtonSize} from "addon-ui";

export default defineConfig({
   components: {
       button: {
           size: ButtonSize.Medium,
           radius: ButtonRadius.Full,
       }
   }
});