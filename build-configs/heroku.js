const webpack = require('webpack');

module.exports = {
	plugins: [
		new webpack.DefinePlugin({
			API_SERVER_ADDRESS: JSON.stringify('https://color-it-back.herokuapp.com')
		}),
	]
};
