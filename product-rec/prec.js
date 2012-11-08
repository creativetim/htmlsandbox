$(function(){
  PREC.application = new PREC.main();
});

var PREC = (typeof PREC === "undefined") ? {} : PREC;

PREC.main = function(){
  "use strict"

  this.animationDuration = 1000;
  this.browserHeight = 0;
  this.browserWidth = 0;
  this.scope = this;



  ////////////////////
  // Global
  ////////////////////

  this.launchClicked = function(e) {
    e.preventDefault();
    $('#prod-rec').show();
  }; // this.launchClicked

  this.unlaunchClicked = function(e) {
    e.preventDefault();
    $('#prod-rec').hide();
  }; // this.unlaunchClicked



  ////////////////////
  // Left panel
  ////////////////////

  // Left header CLICKED
  this.clickLHeader = function(e) {
    var scope = this;

    if ( $(e.currentTarget).hasClass('active') === false ) {
      $('#left').animate({ 'width': '100%' }, this.animationDuration);
      $('#right').animate({ 'width': '0' }, this.animationDuration, function () { $(this).css('display', 'none'); });
      $('#left-header').animate({ 'width': '50%' }, this.animationDuration, function () { $(this).find('span').addClass('active'); });
      $('#left-shower').css('display', 'block').animate({ 'width': '50%' }, this.animationDuration);
    } else {
      scope.backOff(e);
      
      $('#left').animate({ 'width': '50%' }, this.animationDuration, function () {});
      $('#right').css('display', 'block').animate({ 'width': '50%' }, this.animationDuration);
      $('#left-header').animate({ 'width': '100%' }, this.animationDuration, function () { $(this).find('span').removeClass('active'); });
      $('#left-shower').animate({ 'width': '0%' }, this.animationDuration, function () { $(this).css('display', 'none'); });

      e.preventDefault();
      return false;
    }
  }; // this.clickLHeader

  // Left shower CLICKED
  this.clickLShower = function(e) {
    var scope = this;
    e.preventDefault();

    if ( $(e.currentTarget).hasClass('active') === false ) {
      $(e.currentTarget).addClass('active');
      $('#left-header').animate({ 'width': '0' }, this.animationDuration, function () { $(this).css('display', 'none'); });
      $('#left-scents').css('display', 'block').animate({ 'width': '50%' }, this.animationDuration);  
    } else {
      scope.backOff(e);
      $(e.currentTarget).removeClass('active');
      $('#left-scents').animate({ 'width': '0' }, this.animationDuration, function () { $(this).css('display', 'none'); });
      $('#left-shower').animate({ 'width': '50%' }, this.animationDuration);
      $('#left-header').css('display', 'block').animate({ 'width': '50%' }, this.animationDuration);
    }
  }; // this.clickLShower

  // Left scents CLICKED
  this.clickLScents = function(e) {
    var scope = this;
    e.preventDefault();

    if ( $(e.currentTarget).hasClass('active') === false ) {
      $(e.currentTarget).addClass('active');
      $('#left-header').animate({ 'width': '0' }, this.animationDuration, function () { $(this).css('display', 'none'); });
      $('#left-scents').css('display', 'block').animate({ 'width': '50%' }, this.animationDuration);  
    } else {
      scope.backOff(e);
      $(e.currentTarget).removeClass('active');
      $('#left-scents').animate({ 'width': '0' }, this.animationDuration, function () { $(this).css('display', 'none'); });
      $('#left-shower').animate({ 'width': '50%' }, this.animationDuration);
      $('#left-header').css('display', 'block').animate({ 'width': '50%' }, this.animationDuration);
    }
  }; // this.clickLScents



  ////////////////////
  // Mouseovers
  ////////////////////

	this.back = function (e) {
		if ($(e.currentTarget).hasClass('active')) {
			$(e.currentTarget).text('BACK');
		}
	};

	this.backOff = function (e) {
		if ($(e.currentTarget).hasClass('active')) {
			$(e.currentTarget).text($(e.currentTarget).data('original'));
		}
	};



  ////////////////////
  // Utility methods
  ////////////////////

  this.createListeners = function () {
    var scope = this;

    $(window).on('resize', function (e) {scope.getBrowserSize(e); scope.setBrowserSize(e); });

    $('a.launch_prod_rec').on('click', function (e) {scope.launchClicked(e); });
    $('#prod-rec .nav span').on('click', function (e) {scope.unlaunchClicked(e); });

    $('#left-header span').on('click', function (e) { scope.clickLHeader(e); });
    $('#left-header span').on('mouseover', function (e) { scope.back(e); });
    $('#left-header span').on('mouseout', function (e) { scope.backOff(e); });
    $('#left-shower a').on('click', function (e) { scope.clickLShower(e); });
    $('#left-shower a').on('mouseover', function (e) { scope.back(e); });
    $('#left-shower a').on('mouseout', function (e) { scope.backOff(e); });
    $('#left-scents a').on('click', function (e) { scope.clickLScents(e); });
    $('#left-scents a').on('mouseover', function (e) { scope.back(e); });
    $('#left-scents a').on('mouseout', function (e) { scope.backOff(e); });
  }; // this.createListeners

  this.getBrowserSize = function () {
    this.browserHeight = $(window).innerHeight();
    this.browserWidth = $(window).innerWidth();
  }; // this.getBrowserSize

  this.setBrowserSize = function () {
    var that = this;

		if (this.browserHeight % 4 === 0) {
			this.browserHeight += 0;
		} else if (this.browserHeight % 4 === 1) {
			this.browserHeight += 3;
		} else if (this.browserHeight % 4 === 2) {
			this.browserHeight += 2;
		} else {
			this.browserHeight += 1;
		}

    $('#prod-rec').css('height', this.browserHeight);

    $('#left-header h3').css('width', (this.browserWidth / 2));
    $('#left-shower ul').css('width', (this.browserWidth / 2));
    $('#left-scents ul').css('width', (this.browserWidth / 2));

    $('#right-header h3').css('width', (this.browserWidth / 2));
  }; // this.getBrowserSize

  this.setData = function () {
    $('.panel').each(function() {
      $(this).data('original', $(this).text());
    });
  } // this.setData

	this.init = function () {
	  var that = this;

	  this.getBrowserSize();
	  this.setBrowserSize();
		this.createListeners();
		this.setData();
		/*var that = this;
		this.checkForiDevice();
		this.getBrowserSize();
		this.originalTitle = $('title').text();
		this.address = $.address;
		this.checkBrowserSize();
		this.createScrollBars(that);
		this.checkLocation();
		if (this.hash === "") {
			this.removeSplash();
		}
		this.createListeners();
		if ('ontouchstart' in window) {
			$('a, span').not('.scrollbar a').hover(
				function () {
					$(this).css({'color': '#E1E1E1', 'backgroundColor': '#3D3D3D'});
				},
				function () {
					$(this).css({'color': '#E1E1E1', 'backgroundColor': '#2C2C2C'});
				}
			);
		}
		// iPhone chrome remover
		setTimeout(function () { window.scrollTo(0, 1); }, 100);*/
	}; // this.init

	this.init();
}; // PREC.main