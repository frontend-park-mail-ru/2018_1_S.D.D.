const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(serverUrl) {
	return {
		plugins: [
			new HtmlWebpackPlugin({
				serverUrl: serverUrl,
				template: 'src/ui/index.pug',
				inject: 'body',
			})
		],
	};
};