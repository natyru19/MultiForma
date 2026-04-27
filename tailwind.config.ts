import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            primary: "#3E5C76",
            primaryDark: "#2C4457",
            light: "#F7F7F7",
            soft: "#EAEAEA",
            dark: "#1F2933",
        },
        },
    },
    plugins: [],
};

export default config;