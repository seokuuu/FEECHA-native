/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F5A623",
          50: "#FEF7ED",
          100: "#FDEFD4",
          200: "#FBD99A",
          300: "#F8C260",
          400: "#F7B443",
          500: "#F5A623",
          600: "#E08D0A",
          700: "#BA7108",
          800: "#955B06",
          900: "#7A4A05",
        },
        background: "#F9F9F9",
        card: "#FFFFFF",
        text: {
          primary: "#1A1A1A",
          secondary: "#666666",
          muted: "#999999",
        },
      },
      fontFamily: {
        // Expo 기본 폰트 사용
      },
    },
  },
  plugins: [],
};
