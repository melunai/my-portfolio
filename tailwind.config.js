/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        "glow-pink": "0 10px 30px -10px rgba(244, 114, 182, .45)", // rose-400 glow
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sparkle: {
          "0%, 100%": { transform: "scale(1)", opacity: 0.6 },
          "50%": { transform: "scale(1.35)", opacity: 1 },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        sparkle: "sparkle 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
