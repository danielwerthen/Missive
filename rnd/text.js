var _ = require('underscore');

function makeTable(c, r) {
	var table = [];
	for (var i = 0; i < c.length; i++) {
		table.push([]);
		for (var j = 0; j < r.length; j++) {
			if (i == 0 || j == 0) { table[i][j] = 0 }
			else {
				var ci = c[i]
					, rj = r[j]
				if (ci !== rj) {
					var t = table[i - 1][j]
						, l = table[i][j - 1]
					if (t >= l) { table[i][j] = t; }
					else { table[i][j] = l; }
				}
				else {
					table[i][j] = table[i - 1][j - 1] + 1;
				}
			}
		}
	}
	return table;
}

function changeStart(c, r) {
	for (var i = 0; i < c.length; i++) {
		if (i >= r.length)
			return i;
		if (c[i] !== r[i])
			return i;
	}
	if (c.length < r.length)
		return c.length;
	return null;
}

function changeEnd(c, r) {
	var j = r.length - 1;
	var i = c.length - 1;
	while(i >= 0 && j >= 0) {
		if (c[i] !== r[j])
			return c.length - 1 - i;
		j = j - 1;
		i = i - 1;
	}
	return null;
}

function findChanges(table, c, r) {
	var i = c.length - 1
		, j = r.length - 1
		, from = ''
		, to = ''
		, change = false
		, changes = []
	
	while (i > 0 || j > 0) {
		if (c[i] === r[j]) {
			if (change) {
				change.start = i;
				change.from = from;
				change.to = to;
				changes.push(change);
				change = false;
				from = '';
				to = '';
			}
			i = i - 1;
			j = j - 1;
		}
		else {
			if (!change) {
				change = { start: 0, stop: i };
			}
			if (j == 0) {
				from = c[i] + from;
				i = i - 1;
			}
			else if (i == 0 || table[i][j-1] > table[i-1][j]) {
				to = r[j] + to;
				j = j-1;
			}
			else {
				from = c[i] + from;
				i = i - 1;
			}
		}
	}
	if (change) {
		change.start = i;
		change.from = from;
		change.to = to;
		changes.push(change);
		change = false;
		from = '';
		to = '';
	}
	changes.reverse();
	return changes;
}

function applyChanges(changes, c) {
	var v2 = ''
		, li = 1
		, c = '0' + c
	for (var i in changes) {
		var change = changes[i];
		var t = c.substring(li, change.start + 1);
		v2 = v2 + t + change.to;
		li = change.stop + 1;
	}
	v2 = v2 + c.substring(li);
	return v2;
}
function match(a,b) {
	if (a.length !== b.length) return false;
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}


function compare(c, r) {
	var start = changeStart(c,r)
		, stop = changeEnd(c,r)
		, c1 = ''
		, c2 = ''
		, table = null
		, changes = []
	if (start !== null && stop !== null) {
		c1 = '0' + c.substring(start, c.length - stop);
		r1 = '0' + r.substring(start, r.length - stop);
		table = makeTable(c1,r1);
		changes = findChanges(table, c1, r1);
		for (var i in changes) {
			changes[i].start = changes[i].start + start;
			changes[i].stop = changes[i].stop + start;
		}
	}
	else {
		c1 = '0' + c;
		r1 = '0' + r;
		table = makeTable(c1,r1);
		changes = findChanges(table, c1, r1);
	}
	return changes;
}

function transform(c1, c2) {
	var tc = [];
	_.each(c2, function (change) {
		var ts = _.filter(c1, function (el) {
			return el.start <= change.start;
		});
		if (ts && ts.length > 0) {
			var push = _.reduce(ts, function (memo, el) {
				return memo + (el.start + el.to.length - el.stop);
			}, 0);
			if (push < 0)
				push = 0;
			tc.push({ start: change.start + push, stop: change.stop + push, from: change.from, to: change.to }); 
		}
		else
			tc.push(change);
	});
	return tc;
}

function findConflicts(c1, c2) {
	var result = [];
	_.each(c2, function (change) {
		var conflicts = _.filter(c1, function (el) {
			return (el.start >= change.start && el.start <= change.stop)
			 || (el.stop <= change.stop && el.stop >= change.start)
		});
		if (conflicts && conflicts.length > 0)
			result.push({ change: change, conflicts: conflicts });
	});
	return result;
}

var S1 = 'I think this be wrong!'
	, S2 = 'I Wow think this is wrong!'
	, S3 = 'I think that are wrong because of many external factors'
	, S4 = 'I Wow think that are wrong because of many external factors'

/*console.log('S1: ' + S1);
console.log('S2: ' + S2);
console.log('S3: ' + S3);

var c1 = compare(S1, S2);
var c2 = compare(S1, S3);
console.dir(c2);
var r2 = applyChanges(c1, S1);
var r3 = applyChanges(c2, S1);
var tc2 = transform(c1, c2);
var confs = findConflicts(c1, c2);
console.log('Conflicts: ' + confs.length);
console.dir(confs[0]);
var tr3 = applyChanges(tc2, S2);

console.log('Test1: ' + match(S2, r2));
console.log('Test2: ' + match(S3, r3));
console.log('Test3: ' + match(S4, tr3));*/

var lorem = "AAAA"

var lorem2 = "BBBB"
var lorem3 = "CCCCC"
var lorem4 = "JJJ"

var article = { 
	title: 'I have a dream'
	, body: function (set, version) {
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
				.value();
			var tc;
			for (var i in revs) {
				var rev = revs[i];
				if (!tc) {
					tc = compare(rev.body, set);
				}
				else {
					tc = transform(rev.changeset, tc);
				}
			}
			var rev = _.max(this.revisions, function (r) { return r.version; });
			this.revisions.push({ body: applyChanges(tc, rev.body), version: rev.version + 1, changeset: tc });
			return this.body();
		}
	}
	, version: function () {
		return _.max(this.revisions, function (r) { return r.version; }).version;
	}
	, revisions: [ {
		body: lorem
		, version: 0 } 
	] };
console.log('article, version1:');
console.dir(article.body());

//Receive a changeset

var v2 = lorem2

var v3 = lorem3

var v4 = lorem4

//Apply change set 2
console.log('article, version2:');
console.dir(article.body(v2));

console.log('article, version3: ');
console.dir(article.body(v3));

console.log('article, version4: ');
console.dir(article.body(v4));


console.log('Final version: ' + article.version());
