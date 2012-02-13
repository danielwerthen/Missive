var express = require('express')
	, app = express.createServer()
	, mongo = require('mongodb')
	, Db = mongo.Db 
	, Server = mongo.Server
	, server_config = new Server('staff.mongohq.com', 10048, { auto_reconnect: true, native_parser: true})
	, db = new Db('BoleroDB', server_config, {})
	, mongoStore = require('./connect-mongodb')
	, sessionStore = {}
	, helpers = require('./helpers')
	, sign = require('./lib/sign.js')
	, networks = require('./networks/routes')

var start = function () {
	sessionStore = new mongoStore({ db: db });
	app.configure(function () {
		app.settings.env = 'production';
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger({ format: ':method :url' }));
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({
			cookie: {maxAge: 60000 * 20 } // 20 mins
		, secret: 'secret'
		, store: sessionStore
		}));
		helpers.register(app, db);
		app.use(sign.signer(db));
		app.use(app.router);
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/views');
	});

	app.get('/', function (req, res) {
		res.render('index', { user: req.session.user });
	});

	networks.register(app, db);

	var port = process.env.PORT || 3000;
	app.listen(port, function () {
		console.log('Listening on ' + port);
	});
};
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
