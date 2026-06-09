/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Charte Calendz
        sky: "#76CCD6", // primary
        deep: "#1E3A5F", // secondary (titres, éléments sombres)
        coral: "#FF9F7A", // accent (CTAs)
        cloud: "#F5F7FA", // light gray
        slate: "#6B7785", // medium gray text
        anthracite: "#1A1F2E", // dark
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(30, 58, 95, 0.12)",
        card: "0 2px 16px -6px rgba(30, 58, 95, 0.10)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
