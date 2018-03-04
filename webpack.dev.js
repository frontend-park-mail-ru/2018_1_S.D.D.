const path = require('path');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: 'pug-loader'
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'file-loader',
						options : {
							outputPath: 'images/'
						}
					}
				]
			}
		]
	}
};
