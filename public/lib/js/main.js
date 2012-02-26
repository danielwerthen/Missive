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

			//Attach autofit
			$('.autofit')
				.change(autofit)
				.keydown(autofit)
				.keyup(autofit)
				.each(function (elem) {
					autofit.apply(elem, null);
				});
			

		});

		function autofit() {
			var text = $(this).val().replace(/\n/g, '<br/>');
			var copy = $(this).siblings('.autofit-copy');
			if (copy.length > 0)
				copy.html(text);
		}


	}
);
