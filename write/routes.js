var helpers = require('../helpers')
	, Network = require('../models/networks')
	, Article = require('../models/articles')


exports.register = function (app) {
	app.get('/write/revise/:id', function (req, res) {
		if (!req.session.currentNetworkId) return res.redirect('/networks/new');
		Article.findOne({ _id: req.params.id }, function (err, article) {
			if (err) return res.render('error');
			return res.render('write/index', { article: article });
		});
	});

	app.post('/write/revise/:id', function (req, res) {
		Article.findOne({ _id: req.params.id }, function (err, article) {
			if (err || !article) return res.render('error');
			var article = article.addSuggestion(req.body.body, req.body.version, req.session.user._id);
			if (!article) return res.render('error');
			article.validate(function (err) {
				if (err) return res.render('error');
				article.save(function (err) {
					if (err) return res.render('error');
					res.redirect('/review/');
				});
			});
		});
	});

	app.get('/write', function (req, res) {
		if (!req.session.currentNetworkId) return res.redirect('/networks/new');
		return res.render('write/index');
	});
	app.post('/write/save', function (req, res) {
		var article = new Article({
			title: req.body.title
		});
		article.creator = req.session.user._id;
		article.network = req.session.currentNetworkId;
		article.body(req.body.body);
		article.validate(function (err) {
			if (err) return res.redirect('/write', { article: article });
			article.save(function (err) {
				if (err) return res.redirect('/write', { article: article });
				return res.redirect('/review');
			});
		});
	});
};
