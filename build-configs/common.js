const path = require('path');

module.exports = {
	entry: './src/main.js',
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, '../public'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: 'pug-loader'
			},
			{
				test: /\.(scss|css)$/,
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
				test: /\.(svg|jpg|png)$/,
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
