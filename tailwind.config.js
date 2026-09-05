/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FDECEC",
          100: "#FBD4D4",
          200: "#F3A3A3",
          300: "#E77070",
          400: "#D33D3D",
          500: "#B70112",
          600: "#9E0110",
          700: "#82010D",
          800: "#66010A",
          900: "#4A0007",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
