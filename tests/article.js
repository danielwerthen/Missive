var connection = require('../mongoose')
	, Article = require('../models/articles')


connection.on('open', function (err) {
	if (err) return console.dir(err);
	setTimeout(function () {
	console.log('Article test initialized---');
	var article = new Article({ title: 'Test article 01' });
	article.body('Hello mister, how do you do?');
	article.body('Hello mad, how do you do?');
	article.body('Hello mister, how are you do?');
	console.dir(article);
	console.log('Final: ' + article.body());
	connection.close();
	}, 1000);
});
