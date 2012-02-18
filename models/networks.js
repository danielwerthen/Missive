var mongoose = require('mongoose')
	, types = require('mongoose-types')
	, db = require('../mongoose')
	, valid = require('../validators')
	, useTime = types.useTimestamps
	, Schema = mongoose.Schema
	, User = require('./user')

types.loadTypes(mongoose);

var networkUserSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'User' }
});

networkUserSchema.plugin(useTime);

var networkSchema = new Schema({
	name : { type: String, validate : [valid.required, 'Need a name' ] }
	, _creator: { type: Schema.ObjectId, ref: 'User' }
	, users: [networkUserSchema]
});

networkSchema.plugin(useTime);

networkSchema.statics.newNetwork = function newNetwork(name, user, cb) {
	var network = new Network({ 
		name: name
		, _creator: user._id
	});
	network.users.push({user: user._id});
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


var Network = module.exports = db.model('Network', networkSchema);
exports.Schema = networkSchema;

