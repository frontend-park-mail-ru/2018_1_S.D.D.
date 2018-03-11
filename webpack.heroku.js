const webpack = require('webpack-merge');

module.exports = webpack([
	require('./build-configs/common'),
	require('./build-configs/heroku')
]);
