var dbio = require('../lib/db')
	, barrier = require('../lib/barrier')
	, Article = require('../models/articles')

setTimeout(function () {
dbio(function (err, db) {
	if (err) return console.dir(err);
	console.log('begin');
	db.collection('articles', function (err, collection) {
		if (err) return console.dir(err);
		collection.find(function (err, cursor) {
			if (err) return console.dir(err);
			cursor.toArray(function (err, arts) {
				if (err) return console.dir(err);
				console.log(arts.length);
				Update(arts, function () { 
					db.close();
					console.log('end');
				});
			});
		});
	});
});
}, 1000);

function Update(arts, done) {
	var b = barrier(arts.length, done);
	arts.forEach(function (art) {
		Article.findOne({ _id: art._id }, function (err, article) {
			article.revisions = [];
			article.body(art.body);
			article.validate(function (err) {
				if (err) console.dir(err);
				else {
					article.save(function (err) {
						if (err) console.dir(err);
						else console.log('ok');
						b();
					});
					return;
				}
				b();
			});
		});
	});
}
