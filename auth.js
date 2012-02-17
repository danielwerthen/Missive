var db = require('./mongoose')
	, crypto = require('crypto')
	, User = require('./models/user')
	, url = require('url')
	, allowed = []

function hash(str, salt) {
	salt = salt || 'f7ecb8924645bfe335941beb068e7';
	return crypto.createHmac('sha512', salt).update(str).digest('hex');
}

function signin(req, res, next) {
	if (req.method === 'GET') return res.render('signin');
	else if (req.method === 'POST') {
		User.findOne({ email: req.body.email, password: hash(req.body.password) }, function (err, user) {
			if (err || !user) return res.render('signin', { data: { email: req.body.email }, validation: { email: 'error', password: 'error' }});
			req.session.user = user;
			res.redirect('home');
		});
	}
	else return res.redirect('home');
}

function signupModel(user, errors) {
	user = user || {};
	errors = errors || {};
	return {
		user: user,
		errors: errors,
		valid: function (field) {
						if (user[field] !== undefined) return errors[field] ? 'error' : '';
						return '';
					 },
		message: function (field) {
							 return errors[field] ? errors[field].type : '';
						 }
	};
}

function signup(req, res, next) {
	if (req.method === 'GET') {
		res.render('signup', signupModel());
	}
	else if (req.method === 'POST') {
		var _user = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			confirm: req.body.confirm
		}
		var user = new User({ name: _user.name, email: _user.email, password: hash(_user.password) });
		user.validate(function (err) {
			if (req.body.password !== req.body.confirm) {
				err = err || { errors: [] };
				err.errors.confirm = { type: 'Not equal to given password' };
			}
			var validPass = /^.{3,100}$/;
			if (!validPass.test(req.body.password)) {
				err = err || { errors: [] };
				err.errors.password = { type: 'Use a strong password' };
			}
			if (err)
				return res.render('signup', signupModel(_user, err.errors));
			user.save(function (err) {
				if (err) return res.render('error');
				req.session.user = user;
				res.redirect('home');
			});
		});
	}
}

function signout(req, res, next) {
	req.session.destroy();
	res.redirect('home');
}

exports.allow = function (url) {
	allowed.push(url);
}

exports.authenticate = function (app) {
	app.dynamicHelpers({
		user: function (req, res) { return req.session.user; }
	});
	return function (req, res, next) {
		var parts = url.parse(req.url, true);
		if (parts.pathname === '/signin')
			return signin(req, res, next);
		else if (parts.pathname === '/signup')
			return signup(req, res, next);
		else if (parts.pathname === '/signout')
			return signout(req, res, next);
		if (req.session.user)
			next();
		else {
			if (allowed.indexOf('parts.pathname'))
				next();
			else
				redirect('home');
		}
	};
};
