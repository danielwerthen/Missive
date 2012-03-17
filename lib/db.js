var mongo = require('mongodb');

function dbio(open) {
  var self = this,
      username = 'admin',
      password = 'Pass09Word',
      dbname = 'BoleroDB',
      url = 'staff.mongohq.com',
      port = 10048,
      options = {};

  var db = new mongo.Db(dbname, new mongo.Server(url, port, options));

		db.open(function (err, result) {
			if (err) {
				open(err);
				return;
			}
			db.authenticate(username, password, function (err, result) {
				if (result)
					open(null, db);
				else
					open(err);
			});
		});

}
module.exports = dbio;
