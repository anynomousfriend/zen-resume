import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zen Design System Colors
        washi: {
          DEFAULT: '#F2F0EB',
          light: '#F8F7F4',
          dark: '#E8E6E0',
        },
        sumi: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
          dark: '#0A0A0A',
        },
        indigo: {
          DEFAULT: '#2F3640',
          light: '#3F4650',
          dark: '#1F2630',
        },
        vermilion: {
          DEFAULT: '#BC3F3C',
          light: '#CC5F5C',
          dark: '#AC2F2C',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E4BF47',
          dark: '#C49F27',
        },
        sakura: {
          DEFAULT: '#E6C0C0',
          light: '#F6D0D0',
          dark: '#D6B0B0',
        },
        blossom: {
          50: '#fff1f8',
          100: '#ffe4f1',
          200: '#ffc9e5',
          300: '#ff9dce',
          400: '#ff61ad',
          500: '#ff3b94',
          600: '#ff1a7a',
          700: '#df005f',
          800: '#b80050',
          900: '#980347',
          950: '#5f0026',
        },
        night: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
          950: '#500724',
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'var(--font-noto-serif-jp)', 'serif'],
        sans: ['var(--font-inter)', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'petal-fall': 'petalFall 10s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'rotate-enso': 'rotateEnso 60s linear infinite',
        'pulse-blob': 'pulseBlob 10s infinite alternate',
        'reveal-up': 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        rotateEnso: {
          '0%': { transform: 'scale(0.8) rotate(0deg)' },
          '50%': { transform: 'scale(0.85) rotate(180deg)' },
          '100%': { transform: 'scale(0.8) rotate(360deg)' },
        },
        pulseBlob: {
          '0%': { transform: 'scale(1)', opacity: '0.3' },
          '100%': { transform: 'scale(1.2)', opacity: '0.5' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
