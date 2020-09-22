const path = require("path");
const webpack = require("webpack");
const pack = require("./package.json");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

// ./node_modules/eslint-config-xbsoftware/1__double_quotes_and_tabs.js

module.exports = (env) => {
	const production = !!(env && env.production === "true");
	const babelSettings = {
		extends: path.join(__dirname, "/.babelrc")
	};

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
					test: /\.js?$/,
					exclude(modulePath) {
						return /node_modules/.test(modulePath) &&
							!/node_modules[\\/]webix-jet/.test(modulePath) &&
							!/node_modules[\\/]webpack-dev-server/.test(modulePath);
					},
					loader: `babel-loader?${JSON.stringify(babelSettings)}`
				},
				{
					test: /\.(svg|png|jpg|gif)$/,
					use: {
						loader: "file-loader",
						options: {
							name: "[path][name].[ext]"
						}
					}
				},
				{
					test: /\.(less|css)$/,
					loader: ExtractTextPlugin.extract("css-loader!less-loader")
				},
				{
					test: /\.html$/,
					exclude: /node_modules/,
					use: {loader: "html-loader"}
				},
				{
					test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
					loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=[path][name].[ext]"
				},
				{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=[path][name].[ext]"}
			]
		},
		resolve: {
			extensions: [".js"],
			modules: ["./sources", "node_modules"],
			alias: {
				"jet-views": path.resolve(__dirname, "sources/views"),
				"jet-locales": path.resolve(__dirname, "sources/locales")
			}
		},
		devServer: {
			host: process.env.DEV_HOST || "0.0.0.0",
			port: process.env.DEV_PORT || 5000,
			// Path to all other files (e.g. index.html and webix):
			contentBase: ["./codebase", "./node_modules"],
			inline: true,
			disableHostCheck: true
		},
		plugins: [
			new ExtractTextPlugin("./app.css"),
			new HtmlWebpackPlugin({
				template: "index.html"
			}),
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION: production
			}),
			new CopyWebpackPlugin({
				patterns: [
					{from: path.join(__dirname, "sources/images/"), to: "sources/images"},
					{from: path.join(__dirname, "node_modules/webix/"), to: "webix"}
				]
			}),
			new webpack.EnvironmentPlugin({
				SERVER_LIST: [
					{id: "1", value: "DermAnnotator", hostAPI: "http://dermannotator.org:8080/api/v1"},
					{id: "2", value: "ISIC Archive", hostAPI: "https://isic-archive.com/girder/api/v1"},
					{id: "3", value: "Computablebrain", hostAPI: "http://computablebrain.emory.edu:8080/api/v1"},

//					{id: "4", value: "CanineImaging", hostAPI: "http://canine.imagingdatacommons.info/girder/api/v1"}
//					{id: "2", value: "Cancer digital slide archive", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"},
//					{id: "3", value: "Transplant", hostAPI: "http://transplant.digitalslidearchive.emory.edu:8080/api/v1"},
//					{id: "5", value: "Candygram", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"}
				]
			}),
			new Dotenv({
				path: path.resolve(__dirname, ".env") // Path to .env file
			})
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
