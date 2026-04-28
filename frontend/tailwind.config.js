/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0061f2", // Vibrant blue from the image
          dark: "#004dbf",
          foreground: "#ffffff",
        },
        sidebar: {
          active: "#ffffff",
          text: "#e2e8f0",
          hover: "rgba(255, 255, 255, 0.1)",
        },
        dashboard: {
          bg: "#f8f9fc",
          card: "#1e293b",
          "card-blue": "#2d3748",
          "card-green": "#1a2e2e",
          "card-purple": "#2d284a",
          "card-yellow": "#3b2f1a",
        }
      },
    },
  },
  plugins: [],
}
