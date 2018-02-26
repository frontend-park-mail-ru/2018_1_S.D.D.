const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            }
        ]
    }
}
