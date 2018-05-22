const webpack = require('webpack');
const serverUrl = 'https://color-it-back.herokuapp.com';
const wsAddress = 'wss://color-it-back.herokuapp.com/game';

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
