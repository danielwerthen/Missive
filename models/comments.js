var mongoose = require('mongoose')
	, types = require('mongoose-types')
	, db = require('../mongoose')
	, useTime = types.useTimestamps
	, Schema = mongoose.Schema
	, User = require('./user')

types.loadTypes(mongoose);

var commentSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'User' }
	, body: String
});

commentSchema.plugin(useTime);

exports.Schema = commentSchema;
