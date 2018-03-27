const webpack = require('webpack');
const serverUrl = 'https://color-it-back.herokuapp.com';

module.exports = {
	serverUrl: serverUrl,
	dev: {
		plugins: [
			new webpack.DefinePlugin({
				API_SERVER_ADDRESS: JSON.stringify(serverUrl)
			}),
		]
	},
};
