/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,html}'],
	theme: {
		extend: {
			backgroundColor: (theme) => ({
				...theme('colors'),
				primary: '#121316',
				secondary: '#1b1c1f',
				btnColor: '#0157fe',
			}),
			textColor: (theme) => ({
				...theme('colors'),
				primary: 'rgba(255,255,255,.6)',
				secondary: '#1d68ff',
				terciary: '#61AEC9',
			}),
			fontFamily: {
				Montserrat: ['Monserrat', 'sans-serif'],
			},
		},
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true }), require('daisyui')],
}
