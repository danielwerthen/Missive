var connection = require('../mongoose')
	, Article = require('../models/articles')


connection.on('open', function (err) {
	if (err) return console.dir(err);
	setTimeout(function () {
	console.log('Article test initialized---');
	var article = new Article({ title: 'Test article 01' });
	article.body('Hello mister, how do you do?');
	article.body('Hello mad, how do you do?');
	var v2 = 'Hello missy, how are you doing?';
	var conf = article.findConflicts(v2, 0);
	
	console.dir(conf);
	if (conf.length == 0)
		article.body(v2, 0);
	console.dir(article);
	console.log('Final: ' + article.body());
	connection.close();
	}, 1000);
});
