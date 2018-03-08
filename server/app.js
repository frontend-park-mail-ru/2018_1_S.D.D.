/* eslint no-console: 0 */
'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('*', (req, res) => {
	res.sendFile('public/index.html', {root: '.'});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port: ${port}`);
});
