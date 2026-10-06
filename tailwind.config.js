/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './js/main.js'],
    theme: {
        extend: {
            colors: {
                toma: {
                    red: '#D32F2F',
                    orange: '#E8A020',
                    teal: '#1A8A7D',
                    yellow: '#F5C542',
                    dark: '#0A0A0A',
                    darker: '#050505',
                }
            },
            fontFamily: {
                'bebas': ['"Bebas Neue"', 'cursive'],
                'archivo': ['"Archivo Black"', 'sans-serif'],
                'mono': ['"Space Mono"', 'monospace'],
            }
        }
    }
}
