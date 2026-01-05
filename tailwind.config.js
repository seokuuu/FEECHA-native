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
        blue: {
          DEFAULT: "#2196F3",
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#2196F3",
          600: "#1E88E5",
          700: "#1976D2",
          800: "#1565C0",
          900: "#0D47A1",
        },
        gray: {
          DEFAULT: "#9CA3AF",
          50: "#F9F9F9",
          100: "#F5F5F5",
          200: "#E0E0E0",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#666666",
          700: "#4B5563",
          800: "#374151",
          900: "#1A1A1A",
        },
        background: "#F9F9F9",
        card: "#FFFFFF",
        text: {
          primary: "#1A1A1A",
          secondary: "#666666",
          muted: "#999999",
        },
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        banner: "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
      fontFamily: {
        // Expo 기본 폰트 사용
      },
    },
  },
  plugins: [],
};
