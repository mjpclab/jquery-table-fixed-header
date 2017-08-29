const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const PACKAGE_FILE = 'package.json';
const thePackage = JSON.parse(fs.readFileSync(PACKAGE_FILE));

const getEntryConfig = function () {
	return {
		[thePackage.name]: path.resolve(__dirname, thePackage.main),
		[thePackage.nameContainer]: path.resolve(__dirname, thePackage.mainContainer)
	}
};

const getOutputConfig = function (isMinify) {
	return {
		library: '[name]',
		libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist/'),
		filename: '[name]' + (isMinify ? '.min' : '') + '.js'
	};
};

const externalsConfig = {
	jquery: {
		commonjs: 'jquery',
		commonjs2: 'jquery',
		amd: 'jquery',
		root: 'jQuery'
	}
};

module.exports = [
	{
		entry: getEntryConfig(),
		output: getOutputConfig(false),
		externals: externalsConfig,
		plugins: [],
		devtool: 'source-map'
	},
	{
		entry: getEntryConfig(),
		output: getOutputConfig(true),
		externals: externalsConfig,
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					properties: false
				},
				sourceMap: true
			}),
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			})
		],
		devtool: 'source-map'
	}
];