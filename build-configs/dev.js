const webpack = require('webpack');
const serverUrl = 'http://localhost:8080';

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
