/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0C10',
        surface: '#161B22',
        card: '#1F2833',
        primary: '#66FCF1',
        accent: '#833AB4',
        textPrimary: '#F5F5F7',
        textSecondary: '#B0B8C1',
        border: 'rgba(255,255,255,0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 15px rgba(102, 252, 241, 0.4)',
      }
    },
  },
  plugins: [],
}
