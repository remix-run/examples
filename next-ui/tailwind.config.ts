import type { Config } from 'tailwindcss'
const { nextui } = require("@nextui-org/react");
export default {

  content: [
    './app/**/*.{js,jsx,ts,tsx}',

    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  // turn on darkMode 
  darkMode: 'class',
  theme: {
    extend: {},
  },
  /*  add plugin */
  plugins: [nextui()],
} satisfies Config