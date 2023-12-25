/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  safelist: [
    'bg-default-background',
    'text-default-text',
    'bg-default-primary',
    'bg-default-secondary',

    'bg-deuteranopia-background',
    'text-deuteranopia-text',
    'bg-deuteranopia-primary',
    'bg-deuteranopia-secondary',

    'bg-protanopia-background',
    'text-protanopia-text',
    'bg-protanopia-primary',
    'bg-protanopia-secondary',

    'bg-tritanopia-background',
    'text-tritanopia-text',
    'bg-tritanopia-primary',
    'bg-tritanopia-secondary',

    'bg-highContrast-background',
    'text-highContrast-text',
    'bg-highContrast-primary',
    'bg-highContrast-secondary',

    'default-background',
    'default-text',
    'default-primary',
    'default-secondary',

    'deuteranopia-background',
    'deuteranopia-text',
    'deuteranopia-primary',
    'deuteranopia-secondary',

    'protanopia-background',
    'protanopia-text',
    'protanopia-primary',
    'protanopia-secondary',

    'tritanopia-background',
    'tritanopia-text',
    'tritanopia-primary',
    'tritanopia-secondary',

    'highContrast-background',
    'highContrast-text',
    'highContrast-primary',
    'highContrast-secondary',

    'hover:border-default-primary',
    'hover:border-deuteranopia-primary',
    'hover:border-protanopia-primary',
    'hover:border-tritanopia-primary',
    'hover:border-highContrast-primary',

    'hover:bg-default-primaryDark',
    'hover:bg-deuteranopia-primaryDark',
    'hover:bg-protanopia-primaryDark',
    'hover:bg-tritanopia-primaryDark',
    'hover:bg-highContrast-primaryDark',

    `hover:bg-default-primary`,
    `hover:bg-deuteranopia-primary`,
    `hover:bg-protanopia-primary`,
    `hover:bg-tritanopia-primary`,
    `hover:bg-highContrast-primary`,

    'from-default-primaryDark',
    'from-deuteranopia-primaryDark',
    'from-protanopia-primaryDark',
    'from-tritanopia-primaryDark',
    'from-highContrast-primaryDark',

    'to-default-primary',
    'to-deuteranopia-primary',
    'to-protanopia-primary',
    'to-tritanopia-primary',
    'to-highContrast-primary',

    'bg-default-secondaryLight',
    'bg-deuteranopia-secondaryLight',
    'bg-protanopia-secondaryLight',
    'bg-tritanopia-secondaryLight',
    'bg-highContrast-secondaryLight',
  ],
  theme: {
    extend: {
      colors: {
        default: {
          primary: '#04AA6D',       // Green
          primaryDark: '#048a59',  // Darker green
          secondary: '#333',     // Greyish
          secondaryLight: '#4a4a4a', // Darker greyish
          background: '#F0F0F0',    // Light grey for the background
          text: '#ffffff',          // Dark grey for text to ensure readability
        },        
        deuteranopia: {
          primary: '#007bff',
          primaryDark: '#005fc4',
          secondary: '#ffc107',
          background: '#f8f9fa',
          text: '#343a40',
        },
        protanopia: {
          primary: '#17a2b8',
          primaryDark: '#107787',
          secondary: '#28a745',
          background: '#fdfdfe',
          text: '#212529',
        },
        tritanopia: {
          primary: '#d63384',
          primaryDark: '#a32765',
          secondary: '#fd7e14',
          background: '#f7f7f7',
          text: '#1c1e21',
        },
        highContrast: {
          primary: '#dc3545',
          primaryDark: '#992530',
          secondary: '#007bff',
          secondaryLight: '#93c2f5',
          background: '#000000',
          text: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
