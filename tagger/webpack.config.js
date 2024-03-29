const path = require("path");
const webpack = require("webpack");
const pack = require("./package.json");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// ./node_modules/eslint-config-xbsoftware/1__double_quotes_and_tabs.js

// eslint-disable-next-line func-names
module.exports = (env) => {
	const production = !!(env && env.production === "true");
	const babelSettings = {
		extends: path.join(__dirname, "/.babelrc")
	};

	const config = {
		entry: "./sources/app.js",
		output: {
			path: path.join(__dirname, "codebase"),
			publicPath: production ? "./" : "/",
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
			port: process.env.DEV_PORT || 8081,
			// Path to all other files (e.g. index.html and webix):
			contentBase: ["./codebase", "./node_modules"],
			inline: true,
			disableHostCheck: true // public: 'store-client-nestroia1.c9users.io' // would also wokr
		},
		plugins: [
			new ExtractTextPlugin("app.css"),
			new HtmlWebpackPlugin({
				template: "index.html"
			}),
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION: production
			}),
			new CopyWebpackPlugin([
				{from: path.join(__dirname, "sources/images/"), to: "sources/images"},
				{from: path.join(__dirname, "node_modules/webix/"), to: "webix"}

			]),
			new webpack.EnvironmentPlugin({
				SERVER_LIST: [{
		"id": "1",
		"value": "Computable Brain",
		"hostAPI": "https://computablebrain.emory.edu/api/v1"
	},
	{
		"id": "2",
		"value": "Transplant",
		"hostAPI": "http://transplant.digitalslidearchive.emory.edu:8080/api/v1"
	},
	{
		"id": "3",
		"value": "STYX",
		"hostAPI": "https://styx.neurology.emory.edu/girder/api/v1"
	}
				],
				TAGGER_TASKS_COLLECTION_ID: "5e276af412450d0d13e7d361"
			}),
			new webpack.IgnorePlugin(/jet-locales/), // to ignore jet-locales
			new Dotenv({
				path: path.resolve(__dirname, "./.env") // Path to .env file
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
