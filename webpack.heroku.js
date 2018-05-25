const webpack = require('webpack-merge');
const buildConfigHeroku = require('./build-configs/heroku');

module.exports = webpack([
    require('./build-configs/common'),
    buildConfigHeroku.dev,
    require('./build-configs/render')(buildConfigHeroku.serverUrl)
]);
