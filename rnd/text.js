var S1 = '0Hello Kitty, now lets see what that cat can do as far as speed goes'
	, S2 = '0Hello sdkDummy, I think that this will be a change, lets see what this puppy can do as after as optimum goes'
	, S3 = 'AGCAT'
	, S4 = 'GAC'

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
		, lastSpace = 0
		, changes = [];
	
	while (i > 0 && j > 0) {
		if (c[i] === ' ') {
			if (!change) {
				from = '';
				to = '';
			}
		}
		if (c[i] === r[j]) {
			if (change) {
				if (c[i] === ' ') {
					change.from = from;
					change.to = to;
					change.index = i;
					changes.push(change);
					from = '';
					to = '';
					change = false;
				}
			}
			if (change || c[i] !== ' ') {
				from = c[i] + from;
				to = r[j] + to;
			}
			i = i - 1;
			j = j - 1;
		}
		else {
			if (!change)
				change = { stop: lastSpace } ;
			if (table[i][j-1] > table[i-1][j]) {
				to = r[j] + to;
				j = j-1;
			}
			else {
				from = c[i] + from;
				i = i - 1;
			}
		}
		if (c[i] === ' ') {
			lastSpace = i;
		}
	}
	return changes;
}

console.log('S1: ' + S1);
console.log('S2: ' + S2);
var table = makeTable(S1, S2);
var test1 = backtrack(table, S1, S2, S1.length - 1, S2.length - 1);
console.log('LCS: ' + test1);
var test2 = findChanges(table, S1, S2);
console.dir(test2);
//var test1 = LCS(S1, S2);
//console.log(test1);
