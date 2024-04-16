import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        opensans: ["Open Sans", "sans-serif"],
      },
      remix: "linear-gradient(to right, #E74F43 0%, #E557B3 25%, #E55BDF 35%)",
    },
  },
  plugins: [],
} satisfies Config;
