var url = require('url')
	, crypto = require('crypto')

module.exports.signer = function (db) {
	function error(err, res) {
		console.log(err);
		res.redirect('/');
	}
	function hash(str, salt) {
		salt = salt || 'f7ecb8924645bfe335941beb068e7';
		return crypto.createHmac('sha512', salt).update(str).digest('hex');
	}

	function signin(req, res, next) {
		if (req.method === 'GET')
			res.render('signin');
		else if (req.method === 'POST') {
			db.collection('users', function (err, col) {
				if (err) return error(err, res);
				col.findOne({ email: req.body.email, password: hash(req.body.password) }, function (err, user) {
					if (err) return error(err, res);
					req.session.user = user;
					res.redirect('/');
				});
			});
		}
		else
			res.redirect('/');
	}

	function validateField(result, field, test, message) {
		result[field] = test ? 'success' : 'error';
		result[field + 'Message'] = test ? undefined : message;
		if (!test) {
			result.valid = false;
		}
	}

	function validateUser(user) {
		var validEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
			, validPassword = /^.{3,100}$/
			, result = { valid: true };
		validateField(result, 'email', validEmail.test(user.email), 'Not a valid email');
		validateField(result, 'password', validPassword.test(user.password), 'Need a password with at least THREE characters');
		validateField(result, 'confirm', user.password === user.confirm, 'Confirm password by entering it again');
		return result;
	}

	function createUser(user, callback) {
		db.collection('users', function (err, col) {
			if (err) return callback(err);
			var dbUser = { email: user.email
				, password: hash(user.password)
				, created: new Date()
			};
			col.insert(dbUser, function (err, user) {
				if (err) return callback(err);
				if (Array.isArray(user))
					user = user[0];
				callback(null, user);
			});
		});
	}

	function signup(req, res, next) {
		if (req.method === 'GET') {
			res.render('signup');
		}
		else if (req.method === 'POST') {
			var user = {
				email: req.body.email,
				password: req.body.password,
				confirm: req.body.confirm
			};
			var val = validateUser(user);
			if (val.valid) {
				createUser(user, function (err, user) {
					if (err) return error(err, res);
					req.session.user = user;
					res.redirect('/');
				});
			}
			else
				res.render('signup', { validation: validateUser(user), user: user });
		}
		else
			res.redirect('/');
	}

	function signout(req, res, next) {
		req.session.destroy();
		res.redirect('/');
	}

	return function(req, res, next) {
		var parts = url.parse(req.url, true);
		if (parts.pathname === '/')
			next();
		else if (parts.pathname === '/signin')
			signin(req, res, next);
		else if (parts.pathname === '/signup')
			signup(req, res, next);
		else if (parts.pathname === '/signout')
			signout(req, res, next);
		else if (req.session.user) {
			next();
		}
		else {
			res.redirect('/');
		}
	};
};
