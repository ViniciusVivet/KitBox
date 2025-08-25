/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",   // azul base
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        },
        neon: "#22d3ee"     // “neon” ciano
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(1200px 600px at 10% 10%, rgba(34,211,238,.25), transparent 60%), radial-gradient(1000px 500px at 90% 20%, rgba(59,130,246,.22), transparent 60%)'
      }
    }
  },
  plugins: [require("flowbite/plugin")],
}
