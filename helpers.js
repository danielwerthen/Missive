var Network = require('./models/networks')
	, User = require('./models/user')
	, barrier = require('./lib/barrier')

exports.register = function (app) {
	var data = {};
	function loadNetworks(userId, callback) {
		User.findOne({ _id: userId }, ['_id', 'networks'])
			.populate('networks', ['name', '_id'])
			.run(function (err, user) {
				if (err) return callback(err);
				callback(null, user.networks);
			});
	}

	function loadInvites(userId, callback) {
		User.findOne({ _id: userId }, ['email'], function (err, user) {
			if (err) return callback(err);
			Network.find().where('users')
			.elemMatch(function (elem) {
				elem.where('email', user.email);
				elem.where('user', null);
				elem.where('invited', true);
			})
			.only('name')
			.run(callback);
		});
	}
	app.use(function (req, res, next) {
		function handle(err) {
			console.log(err);
		}

		data.networks = [];
		if (req.session.user) {
			var done = barrier(2, function (err) {
				next();
			});
			loadNetworks(req.session.user._id.toString(), function (err, networks) {
				if (err) handle(err);
				data.networks = networks || [];
				if (!req.session.currentNetworkId && networks.length > 0)
					req.session.currentNetworkId = networks[0]._id;
				done(err, networks);
			});
			loadInvites(req.session.user._id.toString(), function (err, networks) {
				if (err) handle(err);
				data.invitations = networks || [];
				done(err, networks);
			});
		}
		else return next();
	});
	function networks(req, res) {
		return data.networks || [];
	}
	function invitations(req, res) {
		return data.invitations || [];
	}
	function currentNetwork(req, res) {
		if (!data.networks)
			return null;
		for (var i = 0; i < data.networks.length; i++) {
			if (data.networks[i]._id.toString() === req.session.currentNetworkId)
				return data.networks[i];
		}
		if (data.networks.length > 0) {
			return data.networks[0];
		}
		else
			return null;
	}
	function user(req, res) {
		return req.session.user;
	}
	exports.currentNetwork = currentNetwork;
	exports.networks = networks;
	exports.invitations = invitations;
	app.dynamicHelpers({
		networks: networks
		, currentNetwork: currentNetwork
		, user: user
		, invitations: invitations
	});
};
