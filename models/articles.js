var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, types = require('mongoose-types')
	, Network = require('./networks')
	, User = require('./user')
	, useTime = types.useTimestamps
	, db = require('../mongoose')

types.loadTypes(mongoose);

var articleSchema = new Schema({
	network: { type: Schema.ObjectId, ref: 'Network', index: true }
	, creator: { type: Schema.ObjectId, ref: 'User', index: true }
	, title: String
	, body: String
});

articleSchema.plugin(useTime);

module.exports = db.model('Article', articleSchema);
exports.Schema = articleSchema;

