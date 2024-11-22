import { resolve } from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const __dirname = import.meta.dirname;

export default {
	entry: "./src/assets/js/index.js",
	output: {
		path: resolve( __dirname, "dist/assets" ),
		filename: "index.js"
	},
	plugins: [ new MiniCssExtractPlugin() ],
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader" ]
			}
		]
	}
};
