// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "glitch-1": {
          "glitch-1": {
            "0%": {
              transform: "translate(0, 0)",
              clip: "rect(65px, 9999px, 119px, 0)",
            },
            "100%": {
              transform: "translate(-5px, -5px)",
              clip: "rect(79px, 9999px, 96px, 0)",
            },
          },
          "glitch-2": {
            "0%": {
              transform: "translate(0, 0)",
              clip: "rect(25px, 9999px, 84px, 0)",
            },
            "100%": {
              transform: "translate(5px, 5px)",
              clip: "rect(61px, 9999px, 120px, 0)",
            },
          },
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          shake: {
            "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
            "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
            "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
            "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
          },
        },
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
};
