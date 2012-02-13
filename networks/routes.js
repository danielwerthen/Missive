exports.register = function (app, db) {
	app.get('/networks', function (req, res) {
		res.render('networks/index');
	});

	// New network
	app.get('/networks/new', function (req, res) {
		res.render('networks/new');
	});

	app.post('/networks/new', function (req, res) {
		var network = { name: req.body.name
			, createBy: req.session.user
			, created: new Date()
			, users: [ { userId: req.session.user._id
				, joined: new Date() } ]
		};
	});

}
