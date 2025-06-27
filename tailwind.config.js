/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // St. Paul's Official Brand Colors
        primary: {
          red: '#a3282f',        // --sp-color-03 (Primary Brand Red)
          blue: '#002f5c',       // --sp-color-09 (Dark Blue)
          darkgray: '#3f4449',   // --sp-color-12 (Primary Text Color)
          gray: '#373737',       // --sp-color-04 (Dark Gray)
          black: '#131313',      // --sp-color-08 (Very Dark Gray)
          white: '#ffffff',      // --sp-color-05 (White)
        },
        secondary: {
          lightgray: '#f8f8f8',    // --sp-color-06 (Light Gray Background)
          bordergray: '#e5e5e5',   // --sp-color-07 (Medium Gray Background)
          mediumgray: '#636363',   // --sp-color-10 (Medium Gray)
          purehblack: '#000000',   // --sp-color-15 (Pure Black)
        },
        // Updated color mappings for better naming
        sp: {
          // Primary brand colors
          'brand-red': '#a3282f',
          'brand-blue': '#002f5c',
          
          // Text colors
          'text-primary': '#3f4449',
          'text-secondary': '#373737',
          'text-medium': '#636363',
          
          // Background colors
          'bg-white': '#ffffff',
          'bg-light': '#f8f8f8',
          'bg-medium': '#e5e5e5',
          'bg-dark': '#131313',
          'bg-black': '#000000',
          
          // Semi-transparent colors
          'overlay-50': 'rgba(63, 68, 73, 0.5)',
          'overlay-25': 'rgba(63, 68, 73, 0.25)',
          'transparent-black': 'rgba(0, 0, 0, 0)',
        },
        // Keep existing structure but update values
        accent: {
          lightgray: '#f8f8f8',
          gray: '#e5e5e5',
          darkgray: '#3f4449',
          black: '#131313'
        },
        overlay: {
          dark: 'rgba(63, 68, 73, 0.95)',
          medium: 'rgba(63, 68, 73, 0.5)',
          light: 'rgba(63, 68, 73, 0.25)',
          white80: 'rgba(255, 255, 255, 0.8)',
          white50: 'rgba(255, 255, 255, 0.5)',
          black70: 'rgba(0, 0, 0, 0.7)',
          black50: 'rgba(0, 0, 0, 0.5)'
        }
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'archer': ['"ArcherPro-Book"', '"ArcherPro-Semibold"', 'serif'],
        'google-sans': ['"Google Sans Text"', 'Helvetica', 'Arial', 'sans-serif'],
        'lora': ['Lora', 'serif'],
        'open-sans': ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        'proxima': ['proxima-nova', 'Helvetica', 'Arial', 'sans-serif'],
        'segoe': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      fontSize: {
        'h1': ['2.8125rem', { lineHeight: '3.5rem' }], // 45px/56px
        'h2': ['1.6875rem', { lineHeight: '1.8125rem' }], // 27px/29px
        'h3': ['1.375rem', { lineHeight: '2rem' }], // 22px/32px
        'body': ['1rem', { lineHeight: '1.5rem' }], // 16px/24px
        'body-sm': ['0.9375rem', { lineHeight: '1.4375rem' }], // 15px/23px
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'navigation': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'highlight': '0 0 0 1px rgba(0, 47, 92, 0.7), 0 0 7px 2px rgba(0, 47, 92, 0.3)',
        'sp-card': '0 2px 10px rgba(163, 40, 47, 0.1)',
        'sp-hover': '0 4px 20px rgba(163, 40, 47, 0.15)'
      },
      borderRadius: {
        'large': '50px',
        'sp': '8px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '15px',
        },
        screens: {
          sm: '100%',
          md: '768px',
          lg: '992px',
          xl: '1170px',
          '2xl': '1200px',
        }
      },
      gradients: {
        'hero-overlay': 'linear-gradient(180deg, rgba(63, 68, 73, 0), rgba(63, 68, 73, 0.95))',
        'sp-brand': 'linear-gradient(135deg, #002f5c 0%, #a3282f 100%)',
        'sp-hero': 'linear-gradient(135deg, #002f5c 0%, #3f4449 50%, #a3282f 100%)',
      },
      transitionDuration: {
        'default': '0.3s',
      },
      transitionTimingFunction: {
        'default': 'ease',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  safelist: [
    'bg-sp-brand-red',
    'bg-sp-brand-blue',
    'bg-primary-red',
    'bg-primary-blue',
    'hover:bg-sp-brand-red/90',
    'hover:bg-primary-red/90',
    'hover:bg-primary-blue/90',
    'text-sp-text-primary',
    'text-sp-brand-red',
    'text-sp-brand-blue',
    'border-sp-brand-red',
    'border-sp-brand-blue'
  ],
  plugins: [],
}