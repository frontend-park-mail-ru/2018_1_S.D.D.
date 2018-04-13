const webpack = require('webpack-merge');
const buildConfigDev = require('./build-configs/dev');

module.exports = webpack([
	require('./build-configs/common'),
	buildConfigDev.dev,
	require('./build-configs/render')(buildConfigDev.serverUrl)
]);
