var express = require('express')
	, app = express.createServer()
	, mongoStore = require('./connect-mongodb')
	, connection = require('./mongoose')
	, auth = require('./auth')
	, User = require('./models/user')

connection.on('open', function (err) {
	if (err) return console.dir(err);
	start();
});

connection.on('error', function (err) {
	console.dir(err);
});

var start = function () {
	var sessionStore = new mongoStore({ db: connection.db });
	app.configure(function () {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger({ format: ':method :url' }));
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({
			cookie: {maxAge: 60000 * 20 } // 20 mins
		, secret: 'secret'
		, store: sessionStore
		}));
		app.use(auth.authenticate(app));
		app.use(app.router);
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/views');
	});

	app.get('/', function (req, res) {
		res.render('index', { user: req.session.user });
	});


	var port = process.env.PORT || 3000;
	app.listen(port, function () {
		console.log('Listening on ' + port);
	});
};
/*
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
});*/
