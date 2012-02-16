var barrier = require('../lib/barrier')
	, mail = require('../mailgun')
	, BSON = require('mongodb').BSONPure;

exports.getUsers = function (network, db, callback) {
	db.collection('users', function (err, col) {
		if (err) return callback(err);
		var filter = { networks: { $elemMatch: { networkId: network._id.toString() } } };
		col.find(filter, function (err, cursor) {
			if (err) return callback(err);
			cursor.toArray(function (err, array) {
				if (err) return callback(err);
				var users = [];
				for (var i in network.users) {
					for ( var a in array ) {
						var found = false;
						if (network.users[i].userId === array[a]._id.toString()) {
							found = true;
							continue;
						}
					}
					users.push({ email: network.users[i].email, invited: !found });
				}
				callback(null, users);
			});
		});
	});
};

exports.addNetwork = function (network, userId, db, callback) {
	db.collection('networks', function (err, col) {
		if (err) return callback(err); 
		col.insert(network, function (err, network) {
			if (err) return callback(err); 
			db.collection('users', function (err, col) {
				if (err) return callback(err);
				network = Array.isArray(network) ? network[0] : network;
				col.update({ _id: BSON.ObjectID(userId) }, { $push: { networks: { networkId: network._id.toString() } } }, true, function (err, data) {
					if (err) callback(err);
					callback(null, network);
				});
			});
		});
	});
};

exports.invite = function (network, email, db, callback) {
	db.collection('networks', function (err, col) {
		if (err) return callback(err);
		var update = {
			$push: { users: { userId: null, email: email, joined: new Date() } }
		};
		col.update({ _id: network._id }, update, false, function (err, data) {
			if (err) return callback(err);
			var body = 'Hi\n\nYou have been invited to join ' + network.name + ' at missive.se. To do so you just need to follow this <a href=\"http://localhost:3000/networks/acceptinvitation/' + network._id + '/' + email + '\">link</a>.';
			mail.sendMail('robot@missive.mailgun.org', email, network.name, body);
			callback(null);
		});
	});
};
