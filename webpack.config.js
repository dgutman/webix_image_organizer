const path = require("path");
const webpack = require("webpack");
const pack = require("./package.json");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")
// ./node_modules/eslint-config-xbsoftware/1__double_quotes_and_tabs.js

module.exports = function (env) {
	const production = !!(env && env.production === "true");
	const babelSettings = {
		extends: path.join(__dirname, "/.babelrc")
	};

	const config = {
		entry: "./sources/app.js",
		output: {
			path: path.join(__dirname, "codebase"),
			publicPath: "/",
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
			new CopyWebpackPlugin([
				{ from: path.join(__dirname, "images/"), to: "sources/images"}]),
			new webpack.EnvironmentPlugin({
				SERVER_LIST: [
					{id: "1", value: "STYX", hostAPI: "https://styx.neurology.emory.edu/girder/api/v1"},
					{id: "2", value: "Girder", hostAPI: "http://dermannotator.org:8080/api/v1"},
					{id: "3", value: "Cancer digital slide archive", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"}
					// {id: "3", value: "ISIC Archive", hostAPI: "https://sandbox.isic-archive.com/api/v1"}
				]
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
