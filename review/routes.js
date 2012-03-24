var helpers = require('../helpers')
	, Network = require('../models/networks')
	, Article = require('../models/articles')
	, _ = require('underscore')


exports.register = function (app) {
	app.get('/review/suggestions/:id', function (req, res) {
		Article.findOne()
			.where('network', req.session.currentNetworkId)
			.where('_id', req.params.id)
			.run(function (err, art) {
				if (err || !art) return res.render('error');
				return res.render('articles/suggestions', { article: art });
		});
	});

	app.get('/review/glance/:id', function (req, res) {
		Article.find()
			.where('network', req.session.currentNetworkId)
			.where('_id', req.params.id)
			.run(function (err, arts) {
				if (err) return res.render('error');
				if (arts.length == 0) return res.end(null);
				return res.partial('articles/_glance', { article: arts[0] });
			});
	});
	app.get('/review/:id?', function (req, res) {
		if (!req.session.currentNetworkId) return res.redirect('/networks/new');
		Article.find()
			.where('network', req.session.currentNetworkId)
			.sort('updatedAt', -1)
			.limit(20)
			.populate('comments.user')
			.run(function (err, arts) {
				if (err) return res.render('error');
				if (arts.length == 0) return res.redirect('/write');
				var article = req.params.id === undefined ?
					arts[0] : _.find(arts,  function (elem) { return elem._id.toString() === req.params.id; });
				return res.render('review/index', { articles: arts, article: article });
			});
	});
	app.post('/review/:id/addComment', function (req, res) {
		Article.findOne({ _id: req.params.id }, function (err, art) {
			if (err) return res.render('error');
			art.addComment(req.body.body, req.session.user);
			art.save(function (err) {
				if (err) return res.render('error');
				res.redirect('back');
			});
		});
	});
};
