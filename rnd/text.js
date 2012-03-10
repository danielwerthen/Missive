
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

function backtrack(table, c, r, i, j) {
	if (i == 0 || j == 0)
		return '';
	else if (c[i] == r[j]) {
		var res = backtrack(table, c, r, i - 1, j - 1);
		return res + c[i];
	}
	else
		if (table[i][j - 1] > table[i - 1][j]) {
			var res = backtrack(table, c, r, i, j - 1) + '+';
			return res;
		}
		else {
			var res = backtrack(table, c, r, i - 1, j) + '-';
			return res;
		}
}

function findChanges(table, c, r) {
	var i = c.length - 1
		, j = r.length - 1
		, from = ''
		, to = ''
		, change = false
		, changes = []
	
	while (i > 0 && j > 0) {
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
			if (table[i][j-1] > table[i-1][j]) {
				to = r[j] + to;
				j = j-1;
			}
			else {
				from = c[i] + from;
				i = i - 1;
			}
		}
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
	c = '0' + c;
	r = '0' + r;
	var table = makeTable(c,r);
	return findChanges(table, c, r);
}

var S1 = 'I think this be wrong!'
	, S2 = 'I think this is wrong!'
	, S3 = 'I think that be wrong because of many external factors'

console.log('S1: ' + S1);
console.log('S2: ' + S2);
console.log('S3: ' + S3);

var c1 = compare(S1, S2);
var c2 = compare(S1, S3);
console.dir(c1);
var r2 = applyChanges(c1, S1);
var r3 = applyChanges(c2, S1);
console.log('r2: ' + r2);
console.log('r3: ' + r3);

console.log('Test1: ' + match(S2, r2));
console.log('Test2: ' + match(S3, r3));

