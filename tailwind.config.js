
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        cdf: {
          primary: '#dc2626',
          'primary-hover': '#b91c1c',
          'primary-dark': '#991b1b',
          secondary: '#6b7280',
          'secondary-hover': '#4b5563',
          dark: '#1a1a1a',
          light: '#f9fafb'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'roboto': ['Roboto', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
