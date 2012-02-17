require(
	[ 'require'
	, 'jquery'
	, '/lib/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {
			var a = $('li#a-' + window.location.pathname.substr(1));
			if (a.length > 0) {
				a.addClass('active');
			}
			$('.control-group.error input').change(function () {
				$(this).closest('.control-group.error').removeClass('error');
				$(this).off('change');
			});

		});


	}
);
