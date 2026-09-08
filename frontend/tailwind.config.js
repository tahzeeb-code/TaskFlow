/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taskflow: {
          primary: '#FFD6E0',
          ink: '#17181C',
          bg: '#EEF2EF',
          surface: '#F7F9F7',
          border: '#DDE3DE',
          text: '#17181C',
          textSecondary: '#5A5C63',
          success: '#B9D9C3',
          warning: '#F4D7A1',
          danger: '#E7A9B0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
