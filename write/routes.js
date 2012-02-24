var helpers = require('../helpers')
	, Network = require('../models/networks')


exports.register = function (app) {
	app.get('/write', function (req, res) {
		if (!req.session.currentNetworkId) return res.redirect('/networks/new');
		return res.render('write/index');
	});
};
