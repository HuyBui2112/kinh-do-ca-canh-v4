/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#007bff',
        'secondary': '#6c757d',
        'tertiary': '#17a2b8',
        'success': '#28a745',
        'danger': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8',
        'light': '#f8f9fa',
        'dark': '#343a40',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#007bff',
              '&:hover': {
                color: '#0056b3',
              },
            },
            h1: {
              color: '#0072b5',
              fontWeight: '700',
            },
            h2: {
              color: '#0072b5',
              fontWeight: '600',
            },
            h3: {
              color: '#0072b5',
              fontWeight: '600',
            },
            h4: {
              color: '#0072b5',
              fontWeight: '600',
            },
            img: {
              borderRadius: '0.5rem',
            },
            code: {
              backgroundColor: '#f1f5f9',
              borderRadius: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            blockquote: {
              borderLeftColor: '#007bff',
              backgroundColor: '#f8f9fa',
              borderRadius: '0.25rem',
              paddingLeft: '1.5rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  future: {
    colorFunction: 'rgb',
  }
} 