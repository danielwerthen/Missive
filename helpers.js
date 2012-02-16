exports.register = function (app, db) {
	var data = {};
	function loadNetworks(userId, callback) {
		db.collection('networks', function (err, networks) {
			if (err) return callback(err);
			var filter = { users: { $elemMatch: { userId: userId } } };
			networks.find(filter, function (err, curs) {
				if (err) return callback(err);
				curs.toArray(function (err, nets) {
					if (err) return callback(err);
					callback(null, nets);
				});
			});
		});
	}
	app.use(function (req, res, next) {
		function handle(err) {
			console.log(err);
			next();
		}

		data.networks = [];
		if (req.session.user) {
			loadNetworks(req.session.user._id.toString(), function (err, networks) {
				if (err) return handle(err);
				data.networks = networks;
				next();
			});
		}
		else return next();
	});
	function networks(req, res) {
		return data.networks || [];
	}
	function currentNetwork(req, res) {
		for (var i = 0; i < data.networks.length; i++) {
			if (data.networks[i]._id.toString() === req.session.currentNetworkId)
				return data.networks[i];
		}
		if (data.networks.length > 0)
			return data.networks[0];
		else
			return null;
	}
	function user(req, res) {
		return req.session.user;
	}
	exports.currentNetwork = currentNetwork;
	exports.networks = networks;
	app.dynamicHelpers({
		networks: networks
		, currentNetwork: currentNetwork
		, user: user
	});
};
