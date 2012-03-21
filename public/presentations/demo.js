$(function () {
	function redraw() {
		var width = $('body').width();
		$('.step').each(function (i,e) {
			$(e).width(width * 0.75 + 'px');
		});
	}
	$(window).resize(redraw);
	redraw();
});
