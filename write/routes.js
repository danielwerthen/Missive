var helpers = require('../helpers')
	, Network = require('../models/networks')
	, Article = require('../models/articles')


exports.register = function (app) {
	app.get('/write', function (req, res) {
		if (!req.session.currentNetworkId) return res.redirect('/networks/new');
		return res.render('write/index');
	});
	app.post('/write/save', function (req, res) {
		var article = new Article({
			body: req.body.body
			, title: req.body.title
		});
		article.creator = req.session.user._id;
		article.network = req.session.currentNetworkId;
		article.validate(function (err) {
			if (err) return res.redirect('/write', { article: article });
			article.save(function (err) {
				if (err) return res.redirect('/write', { article: article });
				return res.redirect('/review');
			});
		});
	});
};
