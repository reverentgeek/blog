import { resolve } from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const __dirname = import.meta.dirname;

export default {
	entry: {
		index: "./src/assets/js/index.js",
		prism: "./src/assets/js/prism.js"
	},
	output: {
		path: resolve( __dirname, "dist/assets" ),
		filename: "[name].js"
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
