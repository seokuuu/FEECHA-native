/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary-dark': 'var(--COLOR-PRIMARY-DARK)',
        'primary': 'var(--COLOR-PRIMARY)',
        'primary-mid': 'var(--COLOR-PRIMARY-MID)',
        'primary-light': 'var(--COLOR-PRIMARY-LIGHT)',
        'primary-light-muted': 'var(--COLOR-PRIMARY-LIGHT-MUTED)',

        'blue': 'var(--COLOR-BLUE)',
        'blue-light': 'var(--COLOR-BLUE-LIGHT)',

        'gray-1': 'var(--COLOR-GRAY-1)',
        'gray-2': 'var(--COLOR-GRAY-2)',
        'gray-3': 'var(--COLOR-GRAY-3)',
        'gray-4': 'var(--COLOR-GRAY-4)',
        'gray-5': 'var(--COLOR-GRAY-5)',
        'gray-6': 'var(--COLOR-GRAY-6)',
        'dark': 'var(--COLOR-DARK)',

        'text-primary': 'var(--COLOR-TEXT-PRIMARY)',
        'text-secondary': 'var(--COLOR-TEXT-SECONDARY)',
        'text-muted': 'var(--COLOR-TEXT-MUTED)',

        'white': 'var(--COLOR-WHITE)',
        'error': 'var(--COLOR-ERROR)',
        'success': 'var(--COLOR-SUCCESS)',
        'warning': 'var(--COLOR-WARNING)',
        'info': 'var(--COLOR-INFO)',

        'background': 'var(--COLOR-BACKGROUND)',
        'card': 'var(--COLOR-CARD)',
      },
      borderRadius: {
        'extra-small': '4px',
        'small': '6px',
        'medium': '8px',
        'large': '12px',
        'extra-large': '16px',
        'extra-extra-large': '20px',
      },
      boxShadow: {
        'sm-gray': '0px 1px 4px 0px rgba(30, 30, 30, 0.1)',
        'md-gray': '0px 6px 8px 0px rgba(30, 30, 30, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'banner': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
