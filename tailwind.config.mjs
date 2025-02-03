/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'], 
      },
      colors: {
        lightGray: "#D1D5DB",
        primary: "#3560AD",
        secondary: "#EF4634",
        darkGray: "#4B4B4B",
        success: "#31CAA8",
        error: "#FF4D39",
        warning: "#FACA15"
      },
      backgroundImage: {
        gradiantBg: "radial-gradient(100% 100% at 50% 0%, #EF4634 0%, #3560AD 100%)",
        gradiantBg2: "radial-gradient(100% 100% at 50% 0%, #FF3189 0%, #FF402A 100%)",
      },
      boxShadow: {
        light: "0px 8px 8px -4px #10182808",
        medium: "0px 20px 24px -4px #10182814",
      },
    },
  },
  plugins: [],
};
