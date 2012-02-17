var mongoose = require('mongoose')
	, types = require('mongoose-types')
	, db = require('../mongoose')
	, useTime = types.useTimestamps
	, Schema = mongoose.Schema;

types.loadTypes(mongoose);

var Email = mongoose.SchemaTypes.Email;

function required(val) {
	if (!val)
		return false;
	if (val === '')
		return false;
	return true;
}

var validEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
function match(reg) {
	return function (val) {
		return reg.test(val);
	};
}

var userSchema = new Schema({
	name : { type: String, validate: [required, 'Any name is fine, really!' ] }
	, email : { type: Email, unique: true, validate: [match(validEmail), 'Please enter a proper email.' ] }
	, password : { type: String, validate: [required, 'Use a strong password please' ] }
});

userSchema.plugin(useTime);

module.exports = db.model('User', userSchema);
exports.Schema = userSchema;
