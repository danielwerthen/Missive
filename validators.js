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

exports.required = required;
exports.match = match;
exports.reg = { 
		email: validEmail
};
