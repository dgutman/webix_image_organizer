const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

const pack = require("./package.json");

function testJSON(text) {
	if (typeof text !== "string") {
        return false;
    }
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = (env) => {
	const production = !!(env && env.production === "true");
	const babelSettings = {
		extends: path.join(__dirname, "/.babelrc")
	};

	const serverList = testJSON(process.env.SERVER_LIST)
		? JSON.parse(process.env.SERVER_LIST)
		: null;
	const singleServer = testJSON(process.env.SINGLE_SERVER)
		? JSON.parse(process.env.SINGLE_SERVER)
		: null;
	const logoLabel = process.env.LOGO_LABEL;

	const config = {
		entry: "./sources/app.js",
		output: {
			path: path.join(__dirname, "codebase"),
			publicPath: "",
			filename: "app.js"
		},
		mode: "development",
		devtool: "inline-source-map",
		module: {
			rules: [
				{
					test: /\.m?js?$/,
					exclude: {
						and: [/node_modules/]
					},
					use: [
						{
							loader: "babel-loader",
							options: {
								...babelSettings
							}
						}
					]
				},
				{
					test: /\.(svg|png|jpg|gif)$/,
					type: "asset/resource"
				},
				{
					test: /\.(less|css)$/,
					use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
				},
				{
					test: /\.html$/,
					exclude: /node_modules/,
					use: {loader: "html-loader"}
				},
				{
					test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
					type: "asset/inline"
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					type: "asset/inline"
				},
				{
					test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
					type: "asset/inline"
				}
			]
		},
		resolve: {
			extensions: [".js", ".mjs"],
			modules: ["./sources", "node_modules"],
			alias: {
				"jet-views": path.resolve(__dirname, "sources/views"),
				"jet-locales": path.resolve(__dirname, "sources/locales"),
			}
		},
		devServer: {
			host: process.env.DEV_HOST || "0.0.0.0",
			port: process.env.DEV_PORT || 5000,
			// Path to all other files (e.g. index.html and webix):
			static: [
				{
					directory: path.join(__dirname, "./codebase")
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION: production
			}),
			new CopyWebpackPlugin({
				patterns: [
					{from: path.resolve(__dirname, "sources/images/"), to: "sources/images"},
					{from: path.resolve(__dirname, "node_modules/webix/"), to: "webix"},
					{from: path.resolve(__dirname, "index.html")},
					{from: path.resolve(__dirname, "node_modules/paper/"), to: "paper"},
					{from: path.resolve(__dirname, "node_modules/openseadragon/"), to: "openseadragon"}
				]
			}),
			new webpack.EnvironmentPlugin({
				SERVER_LIST: serverList,
				SINGLE_SERVER: singleServer,
				// ENABLE/DISABLE MODULES (TABS)
				TABSTATE: {
					metadata: "enable",
					applyFilter: "enable",
					pathologyReport: "enable",
					aperioAnnotations: "disable"
				},
				LOGO_LABEL: logoLabel,
			}),
			new Dotenv({
				path: path.resolve(__dirname, ".env") // Path to .env file
			}),
			new MiniCssExtractPlugin()
		]
	};

	if (production) {
		config.plugins.push(
			new TerserPlugin({
				test: /\.js(\?.*)?$/i
			})
		);
	}

	return config;
};
