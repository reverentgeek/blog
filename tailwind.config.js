import colors from "tailwindcss/colors";

export default {
	content: [
		"./src/site/_includes/**/*.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}",
		"./src/site/*.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}",
		"./src/site/pages/*.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}",
		"./src/site/posts/*.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}"
	],
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			rgblue: "#6FC2FF",
			blue: colors.blue,
			gray: colors.gray,
			white: colors.white,
			red: colors.red,
			orange: colors.orange
		},
		fontFamily: {
			sans: [
				"Roboto",
				"-apple-system",
				"BlinkMacSystemFont",
				"\"Segoe UI\"",
				"\"Helvetica Neue\"",
				"Arial",
				"\"Noto Sans\"",
				"sans-serif",
				"\"Apple Color Emoji\"",
				"\"Segoe UI Emoji\"",
				"\"Segoe UI Symbol\"",
				"\"Noto Color Emoji\"",
			],
			serif: [
				"Georgia",
				"Cambria",
				"\"Times New Roman\"",
				"Times",
				"serif",
			],
			mono: [
				"Menlo",
				"Monaco",
				"Consolas",
				"\"Liberation Mono\"",
				"\"Courier New\"",
				"monospace",
			],
		}
	}
};
