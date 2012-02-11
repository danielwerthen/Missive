var express = require('express')
	, app = express.Server(express.logger())

app.get('/', function (req, res) {
	res.end('Hello world');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Listening on ' + port);
});
