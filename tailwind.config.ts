import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marias: {
          cream: "#F9F6EE",
          green: "#1B4D2E",
          navy: "#0B2545",
          gold: "#C59B27",
          red: "#D32F2F",
        },
      },
    },
  },
  plugins: [],
};
export default config;