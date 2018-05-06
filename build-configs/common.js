const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, '../public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', {
                                'targets': {
                                    'browsers': ['last 2 versions']
                                }
                            }]]
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            "useBabel": true,
                            "babelOptions": {
                                "babelrc": false, /* Important line */
                                "presets": [
                                    ["env", { "targets": "last 2 versions, ie 11", "modules": false }]
                                ]
                            },
                        }
                    }
                ]
            },
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
