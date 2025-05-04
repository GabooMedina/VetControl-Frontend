import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
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
        // Colores base de shadcn/ui (actualizados)
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
        
        // Colores personalizados para VetControl
        turquoise: {
          50: "#E6F7F7",
          100: "#C0EBEB",
          200: "#96DEDE",
          300: "#6BD1D1",
          400: "#41C4C4",
          500: "#16B7B7",
          600: "#00B2B2", // Color principal
          700: "#009999", // Hover/active
          800: "#007777", // Más oscuro
          900: "#005555", // Muy oscuro
        },
        navy: {
          50: "#E8EBF0",
          100: "#C5CDDC",
          200: "#A2AEC8",
          300: "#7F90B4",
          400: "#5C71A0",
          500: "#39538C",
          600: "#2A4178",
          700: "#1B2F64",
          800: "#1A2A4A", // Color principal
          900: "#0D1525",
        },
        amber: {
          600: "#FF9F1C", // Color del logo
        },
        sky: {
          50: "#F0F9FF", // Fondo claro
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Fuente principal
      },
      fontSize: {
        "page-title": ["1.75rem", "2rem"], // Tamaño para títulos de página (28px)
        "sidebar-title": ["1.5rem", "1.75rem"], // Títulos del sidebar
      },
      boxShadow: {
        "header": "0 2px 8px rgba(0, 0, 0, 0.1)", // Sombra para el header
        "card": "0 4px 12px rgba(0, 0, 0, 0.08)", // Sombra para tarjetas
        // Nueva sombra para inputs enfocados
        "input-focus": "0 0 0 2px hsl(var(--ring))", 
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"), // Para estilizar formularios
  ],
} satisfies Config;

export default config;