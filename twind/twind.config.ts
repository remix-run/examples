import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import { defineConfig } from "twind";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  // config goes here
});
