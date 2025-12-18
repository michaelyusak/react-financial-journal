/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "toast-bounce": "increasing-bounce 2s linear",
      },
      keyframes: {
        "increasing-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "10%": { transform: "translateY(-20%)" },
          "20%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-15%)" },
          "40%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10%)" },
          "60%": { transform: "translateY(0)" },
          "70%": { transform: "translateY(-5%)" },
          "80%": { transform: "translateY(0)" },
          "90%": { transform: "translateY(-2%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
