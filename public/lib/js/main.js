require(
	[ 'require'
	, 'jquery'
	, '/lib/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {
			console.log(window.location.pathname.substr(1));
			var a = $('li#a-' + window.location.pathname.substr(1));
			if (a.length > 0) {
				a.addClass('active');
			}
		});
	}
);
