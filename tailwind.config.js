import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        // outletcolor: "hsl((--bg-outlet-background))",
        outletcolor: "#F7F7F7",
        lightprimary: "#EEFFEE",
        lightprimaryborder: "#77DD77",
        lightwarning: "#FFE0E0",
        lightwarningborder: "#FF8D8C",
        // tableheader: "hsl((--table-header-color))",
        tableheader: "#F5F5F5",
        hoverprimary: "#E4FFE4",
        failure: "hsl((--bg-secondary-red))",
        maintextColor: "hsl((--text-main-color))",
        bgbackground: "hsl((--background-color))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        textprimary: "hsl(var(--primary))",
        textgray: "hsl(var(--input))",
        checkboxborder: "hsl(var(--border-color-check))",
        textwhite: "hsl(var(--secondary-foreground1))",
        bggray: "hsl(var(--background-gray))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    screens: {
      xs: "320px",
      smm: "375px",
      xsm: "480px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      mdxs: "800px",
      // => @media (min-width: 768px) { ... }
      mdx: "992px",
      slg: "1000px",
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xlg: "1100px",
      xbase: "1250px",
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      sxl: "1350px",
      "2xl": "1536px",
      "4xl": "1920px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [tailwindAnimate],
};
