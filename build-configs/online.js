const webpack = require('webpack');
const serverUrl = 'https://color-it.online';
const wsAddress = 'wss://color-it.online/game';

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
