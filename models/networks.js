var mongoose = require('mongoose')
	, types = require('mongoose-types')
	, db = require('../mongoose')
	, valid = require('../validators')
	, useTime = types.useTimestamps
	, Schema = mongoose.Schema
	, User = require('./user')
	, _ = require('underscore')

types.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

var networkUserSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'User' }
	, invited: Boolean
	, email : { type: Email, validate: [valid.match(valid.reg.email), 'Please enter a proper email.' ] }
});


networkUserSchema.pre('save', function (next) {
	next();
});

networkUserSchema.plugin(useTime);

var networkSchema = new Schema({
	name : { type: String, validate : [valid.required, 'Need a name' ] }
	, _creator: { type: Schema.ObjectId, ref: 'User' }
	, users: [networkUserSchema]
});

networkSchema.plugin(useTime);

networkSchema.statics.join = function join(nid, user, cb) {
	Network.findOne({ _id: nid }, function (err, network) {
		if (err || !network) return cb(err);
		var un = _.find(network.users, function (i) { return i.email === user.email; });
		if (!un) return cb('User not invited to network');
		un.user = user._id;
		un.invited = false;
		network.save(function (err) {
			if (err) return cb(err);
			User.update({ _id: user._id }, { $push: { networks: nid } }, function (err) {
				if (err) return cb(err);
				cb();
			});
		});
	});
};

networkSchema.statics.newNetwork = function newNetwork(name, user, cb) {
	var network = new Network({ 
		name: name
		, _creator: user._id
	});
	network.users.push({user: user._id, email: user.email, invited: false});
	network.validate(function (err) {
		if (err) return cb(err);
		network.save(function (err) {
			if (err) return cb(err);
			User.findOne({_id: user._id }, function (err, user) {
				if (err) return cb(err);
				user.networks.push(network._id);
				user.save(function (err) {
					if (err) return cb(err);
					cb(null, network);
				});
			});
		});
	});
};

networkSchema.methods.addUser = function addUser(email) {
	this.users.push({ email: email, user: null, invited: true });
	return this;
};


var Network = module.exports = db.model('Network', networkSchema);
exports.Schema = networkSchema;

