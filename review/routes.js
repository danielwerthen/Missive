var helpers = require('../helpers')
	, Network = require('../models/networks')
	, Article = require('../models/articles')
	, _ = require('underscore')


exports.register = function (app) {
	app.get('/review/:id?', function (req, res) {
		if (!req.session.currentNetworkId) return res.redirect('/networks/new');
		Article.find()
			.where('network', req.session.currentNetworkId)
			.sort('updatedAt', -1)
			.limit(20)
			.run(function (err, arts) {
				if (err) return res.render('error');
				if (arts.length == 0) return res.redirect('/write');
				var article = req.params.id === undefined ?
					arts[0] : _.find(arts,  function (elem) { return elem._id.toString() === req.params.id; });
				return res.render('review/index', { articles: arts, article: article });
			});
	});
};
