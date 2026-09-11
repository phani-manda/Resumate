import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        subtle: "var(--bg-subtle)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
          text: "var(--accent-text)",
        },
        action: {
          DEFAULT: "var(--action)",
          hover: "var(--action-hover)",
          subtle: "var(--action-subtle)",
          text: "var(--action-text)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        line: {
          DEFAULT: "var(--border-color)",
          strong: "var(--border-strong)",
        },
        success: {
          DEFAULT: "var(--success)",
          subtle: "var(--success-subtle)",
          text: "var(--success-text)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          subtle: "var(--warning-subtle)",
          text: "var(--warning-text)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          subtle: "var(--danger-subtle)",
          text: "var(--danger-text)",
        },
        info: {
          DEFAULT: "var(--info)",
          subtle: "var(--info-subtle)",
          text: "var(--info-text)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-xl": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-lg": ["3rem", { lineHeight: "1.10", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "600" }],
        "display-sm": ["1.875rem", { lineHeight: "1.20", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-xl": ["1.5rem", { lineHeight: "1.30", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-lg": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.005em", fontWeight: "600" }],
        "heading-md": ["1.125rem", { lineHeight: "1.40", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.65" }],
        "body-md": ["0.9375rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.60" }],
        caption: ["0.8125rem", { lineHeight: "1.50", letterSpacing: "0.005em" }],
        label: ["0.75rem", { lineHeight: "1.40", letterSpacing: "0.06em", fontWeight: "600" }],
      },
      boxShadow: {
        card: "var(--shadow-sm)",
        elevated: "var(--shadow-md)",
        modal: "var(--shadow-lg)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      transitionTimingFunction: {
        spring: "var(--ease)",
      },
      transitionDuration: {
        DEFAULT: "var(--duration)",
        base: "var(--duration)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
