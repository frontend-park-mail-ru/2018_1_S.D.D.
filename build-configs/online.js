const webpack = require('webpack');
const serverUrl = 'https://color-it.online';
const wsAddress = 'https://color-it.online/wss/game';

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
