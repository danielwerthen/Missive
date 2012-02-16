var helpers = require('../helpers')
	, data = require('./data')
	, sign = require('../lib/sign')

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

function getMembers(network, users) {
	
}


exports.register = function (app, db) {
	app.get('/networks', function (req, res) {
		var cn = helpers.currentNetwork(req, res);
		if (cn === null) return res.redirect('/networks/new');
		data.getUsers(cn, db, function (err, users) {
			if (err) return res.render('error');
			res.render('networks/index', { users: users });
		});
	});

	app.post('/networks/invite', function (req, res) {
		var cn = helpers.currentNetwork(req, res);
		data.invite(cn, req.body.email, db, function (err) {
			if (err) return res.render('error');
			res.redirect('/networks/#users');
		});
	});

	var acceptInvitation = '/networks/acceptinvitation/:networkId/:userEmail/';
	sign.allow(acceptInvitation);
	app.get(acceptInvitation, function (req, res) {
		data.getNetwork(req.params.networkId, function (err, network) {
			if (err || !network) return res.redirect('home');
			var foundEmail = false;
			for (var i in network.users) {
				if (network.users[i].email === req.params.userEmail)
					foundEmail = true;
			}
			if (!foundEmail) return res.redirect('home');
		});
	});

	// New network
	app.get('/networks/new', function (req, res) {
		res.render('networks/new');
	});

	app.post('/networks/new', function (req, res) {
		var network = createNetwork(req.body.name, req.session.user);
		data.addNetwork(network, req.session.user._id, db, function (err, network) {
			if (err) return res.render('error');
			req.session.currentNetworkId = network._id;
			res.redirect('/networks');
		});
	});

	app.get('/networks/byId/:id', function (req, res) {
		req.session.currentNetworkId = req.params.id;
		res.redirect('back');
	});

}
