var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, types = require('mongoose-types')
	, Comment = require('./comments')
	, User = require('./user')
	, useTime = types.useTimestamps
	, db = require('../mongoose')

types.loadTypes(mongoose);

var articleSchema = new Schema({
	network: { type: Schema.ObjectId, ref: 'Network', index: true }
	, creator: { type: Schema.ObjectId, ref: 'User', index: true }
	, comments: [ Comment.Schema ]
	, title: String
	, body: String
});

articleSchema.plugin(useTime);

articleSchema.methods.addComment = function addComment(body, user) {
	this.comments.push({ body: body, user: user._id });
	return this;
};

var Article = module.exports = db.model('Article', articleSchema);
exports.Schema = articleSchema;

