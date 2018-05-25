const webpack = require('webpack');
const serverUrl = 'http://localhost:8080';
const wsAddress = 'ws://localhost:8080/game';

module.exports = {
    serverUrl: serverUrl,
    dev: {
        plugins: [
            new webpack.DefinePlugin({
                API_SERVER_ADDRESS: JSON.stringify(serverUrl),
                WS_ADDRESS: JSON.stringify(wsAddress)
            }),
        ]
    },
};
