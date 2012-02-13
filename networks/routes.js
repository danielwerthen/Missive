function createNetwork(name, creator) {
	var network = { name: name
		, createBy: creator._id
		, created: new Date()
		, users: [ { userId: creator._id
			, email: creator.email
			, joined: new Date() } ]
	};

	return network;
}


exports.register = function (app, db) {
	app.get('/networks', function (req, res) {
		res.render('networks/index');
	});

	// New network
	app.get('/networks/new', function (req, res) {
		console.log('wtht');
		res.render('networks/new');
	});

	app.post('/networks/new', function (req, res) {
		var network = createNetwork(req.body.name, req.session.user);
		db.collection('networks', function (err, col) {
			if (err) return res.render('error', err);
			col.insert(network, function (err, col) {
				if (err) return res.render('error', err);
				res.redirect('/networks');
			});
		});

	});

	app.get('/networks/byId/:id', function (req, res) {
		req.session.currentNetworkId = req.params.id;
		res.redirect('back');
	});

}
