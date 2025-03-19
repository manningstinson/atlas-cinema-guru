/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnightBlue: "#00003c",
        teal: "#1ed2af",
        mintyTeal: "#3EEFC5",
        navy: "#000080",
      },
    },
  },
  plugins: [],
};
