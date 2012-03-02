var express = require('express')
	, fs = require('fs')
	, app = express.createServer()
	, mongoStore = require('./connect-mongodb')
	, connection = require('./mongoose')
	, auth = require('./auth')
	, User = require('./models/user')
	, helpers = require('./helpers')

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
		helpers.register(app);
		app.use(auth.authenticate(app));
		app.use(app.router);
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/views');

	});
	
	app.get('/markdown.js', function (req, res) {
		fs.readFile(__dirname + '/node_modules/markdown/lib/markdown.js', function (err, data) {
			if (err) return res.render('error');
			res.writeHead(200, {'Content-Type': 'text/javascript' });
			res.end(data);
		});
	});

	app.get('/', function (req, res) {
		res.render('index', { user: req.session.user });
	});
	([ 'networks' 
	 , 'review'
	 , 'write' ]).forEach(function (route) {
		var routes = require('./' + route + '/routes');
		routes.register(app);
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
