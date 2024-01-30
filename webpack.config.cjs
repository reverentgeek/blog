"use strict";

const path = require( "path" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

module.exports = {
	entry: "./src/assets/js/index.js",
	output: {
		path: path.resolve( __dirname, "dist/assets" ),
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
