const webpack = require('webpack');

module.exports = {
	plugins: [
		new webpack.DefinePlugin({
			API_SERVER_ADDRESS: JSON.stringify('http://localhost:8080')
		}),
	]
};
