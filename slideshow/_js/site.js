bootstrap(function () {
	//bootstrap.css('screen');

	bootstrap.require('jquery-1.7.2.min', function () {
		jQuery(function ($) {
			$('html').addClass('loaded');

		});
	});
	//bootstrap.js('jquery.rails');
});
