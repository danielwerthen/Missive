var mongoose = require('mongoose')
	, types = require('mongoose-types')
	, db = require('../mongoose')
	, useTime = types.useTimestamps
	, Schema = mongoose.Schema
	, valid = require('../validators')

types.loadTypes(mongoose);

var Email = mongoose.SchemaTypes.Email;

var userSchema = new Schema({
	name : { type: String, validate: [valid.required, 'Any name is fine, really!' ] }
	, email : { type: Email, unique: true, validate: [valid.match(valid.reg.email), 'Please enter a proper email.' ] }
	, password : { type: String, validate: [valid.required, 'Use a strong password please' ] }
	, networks : [{ type: Schema.ObjectId, ref: 'Network' }]
});

userSchema.plugin(useTime);

module.exports = db.model('User', userSchema);
exports.Schema = userSchema;
