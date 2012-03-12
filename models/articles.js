var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, types = require('mongoose-types')
	, Comment = require('./comments')
	, User = require('./user')
	, useTime = types.useTimestamps
	, db = require('../mongoose')
	, vc = require('../lib/versionControl')
	, _ = require('underscore')

types.loadTypes(mongoose);

var articleSchema = new Schema({
	network: { type: Schema.ObjectId, ref: 'Network', index: true }
	, creator: { type: Schema.ObjectId, ref: 'User', index: true }
	, comments: [ Comment.Schema ]
	, title: String
	, revisions: [ {
		body: { type: String }
		, version: { type: Number }	} ]
	, suggestions: [ {
		body: { type: String }
		, user: { type: Schema.ObjectId, ref: 'User' }
		, version: { type: Number } } ]
});

articleSchema.plugin(useTime);

articleSchema.methods.addComment = function addComment(body, user) {
	this.comments.push({ body: body, user: user._id });
	return this;
};

articleSchema.methods.body = function body(set, version) {
	if (!set) {
		return _.chain(this.revisions)
			.sortBy(function (rev) { return -rev.version; })
			.first()
			.value()
			.body;
	}
	else {
		version = version || 0;
		var revs = _.chain(this.revisions)
			.filter(function (rev) { return rev.version >= version; })
			.sortBy(function (rev) { return rev.version; })
			.value()
			, body = set
			, version = 0;
		if (revs.length > 0) {
			var first = revs[0]
				, last = revs[revs.length - 1]
				, rc = vc.compare(first.body, last.body)
				, tc = vc.compare(first.body, set)
			tc = vc.transform(rc, tc);
			console.log(last.body);
			console.dir(tc);
			body = vc.applyChanges(tc, last.body);
			version = last.version + 1;
		}
		this.revisions.push({ body: body, version: version });
		return this.body();
	}
};

articleSchema.methods.findConflicts = function findConflicts(body, version) {
	if (this.revisions.length <= 1)
		return [];
	var revs = _.chain(this.revisions)
		.filter(function (rev) { return rev.version >= version; })
		.sortBy(function (rev) { return rev.version; })
		.value()
		, body = set
		, version = 0
		, first = revs[0]
		, last = revs[revs.count - 1]
		, rc = vc.compare(first.body, last.body)
		, tc = vc.compare(first.body, set)

	//tc = vc.transform(rc, tc));
	return vc.findConflicts(rc, tc);
};

articleSchema.methods.addSuggestion = function addSuggestion(body, version, user) {
	var rev = _.find(this.revisions, function (r) { return r.version == version; });
	if (rev) {
		this.suggestions.push({ body: body, version: version, user: user._id });
		return this;
	}
	else return null;
};

var Article = module.exports = db.model('Article', articleSchema);
exports.Schema = articleSchema;

