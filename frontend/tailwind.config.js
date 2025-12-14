/** @type {import('tailwindcss').Config} */
export default {
      content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
            extend: {
                  fontFamily: {
                        sans: ['Nunito', 'sans-serif'],
                  },
                  colors: {
                        brand: {
                              50: '#fdf2f8',
                              100: '#fce7f3',
                              200: '#fbcfe8',
                              300: '#f9a8d4',
                              400: '#f472b6',
                              500: '#ec4899', // Main Pink
                              600: '#db2777',
                              700: '#be185d', // Deep Berry
                              800: '#9d174d',
                              900: '#831843',
                        },
                        cream: '#fff1f2',
                  }
            },
      },
      plugins: [],
}