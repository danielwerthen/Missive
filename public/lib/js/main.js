require(
	[ 'require'
	, 'jquery'
	, '/markdown.js'
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
				.each(function (i, elem) {
					autofit.apply(elem, null);
				});

			$('.markdown').each(function (i, element) {
				automark.apply(element, null);
			});
			$("textarea.accept-tab").keydown(function(e) {
				if(e.keyCode === 9) { // tab was pressed
					// get caret position/selection
					var start = this.selectionStart;
					end = this.selectionEnd;

					var $this = $(this);

					// set textarea value to: text before caret + tab + text after caret
					$this.val($this.val().substring(0, start)
						+ "\t"
						+ $this.val().substring(end));

					// put caret at right position again
					this.selectionStart = this.selectionEnd = start + 1;

					// prevent the focus lose
					return false;
				}
			});

		});

		function autofit() {
			var text = $(this).val().replace(/\n/g, '<br/>');
			var copy = $(this).siblings('.autofit-copy');
			if (copy.length > 0)
				copy.html(text);
		}

		function automark() {
			var div = $(this)
				, form = $('#' + div.attr('data-for'))
				, ti = form.find('[name=title]')
				, bi = form.find('[name=body]')
				, title = $('<h1>' + ti.val() + '</h1>').appendTo(div)
				, body = $('<div>' + bi.val() + '</div>').appendTo(div)
			ti.keyup(function () {
				title.html(ti.val());
			});
			bi.keyup(function () {
				body.html(window.markdown.toHTML(bi.val()));
			});
		}


	}
);
