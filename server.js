var express = require('express')
	, app = express.createServer(express.logger())
	, mongo = require('mongodb')
	, Db = mongo.Db 
	, Server = mongo.Server
	, server_config = new Server('staff.mongohq.com', 10048, { auto_reconnect: true, native_parser: true})
	, db = new Db('BoleroDB', server_config, {})
	, mongoStore = require('connect-mongodb')
	, sessionStore = {}
db.open(function (err, result) {
	if (err)
		console.log(err);
	else
		db.authenticate('admin', 'Pass09Word', function (err, result) {
			if (err)
				console.log(err);
			else {
				start();
			}
		});
});
var start = function () {
	sessionStore = new mongoStore({ db: db });
	app.configure(function () {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger());
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({
			cookie: {maxAge: 60000 * 20 } // 20 mins
		, secret: 'secret'
		, store: sessionStore
		}));
		app.use(app.router);
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/views');
	});

	app.get('/', function (req, res) {
		res.write(req.sessionID + '\n');
		res.end('hello world');
	});

	var port = process.env.PORT || 3000;
	app.listen(port, function () {
		console.log('Listening on ' + port);
	});
};
