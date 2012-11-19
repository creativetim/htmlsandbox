function StepThrough(element) {
  this.$element = element = $(element);

  this.steps = {
    '$splash': $('#splash'),
    '$lifestyles': $('#lifestyles'),
    '$selector': $('#selector'),
    '$results': $('#results')
  };

	// setup event listeners
	this._setupEventListeners();

};

StepThrough.prototype = {
  _setupEventListeners: function () {
		var $element = this.$element;

		$(window).on('load', $.proxy(this, 'showSplash'));
		
		$element.on('click', '#open-lifestyles', $.proxy(this, 'showLifestyles'));
		$element.on('click', '#open-selector', $.proxy(this, 'showSelector'));
		$element.on('click', '#open-results', $.proxy(this, 'showSelector'));
  },
  showSplash: function() {
    console.log('SHOW SPLASH');
    this.resetPanels();
    this.steps.$splash.addClass('open');
  },
  showLifestyles: function() {
    console.log('SHOW LIFESTYLES');
    this.resetPanels();
    this.steps.$lifestyles.addClass('open');
  },
  showSelector: function() {
    console.log('SHOW SELECTOR');
    this.resetPanels();
    this.steps.$selector.addClass('open');
    var selector = new RVSelector(this.steps.$selector);
  },
  showResults: function() {
    console.log('SHOW RESULTS');
    this.resetPanels();
    this.steps.$results.addClass('open');
  },
  resetPanels: function() {
    this.$element.children().removeClass('open');
  }
};

function RVSelector(element) {
  // setup selectors
	this.$element = element = $(element);
	this.$currentQuestionCounter = element.find('.current-question span');
	this.$products = this.$element.find('.grid li');
	this.$results = $('#results .rv');

	// setup properties
	this.currentQuestion = 1;
	this.currentQuestionCount = 1;
	this.answerSet = {}
	this.products = element.find('.rv-info');
	this.questions = element.find('.question');
	this.productList = 'A B C TT 5thW EXP FCT TC'.split(' ');
	this.activeProducts = new Array();

	// setup event listeners
	this._setupEventListeners();

	// initialize the tool
	this.startOver();

}

RVSelector.prototype = {
	_setupEventListeners: function () {
		var $element = this.$element;

		$element.on('change', ':radio', $.proxy(this, 'onAnswerChange'));
		$element.on('click', 'button.next', $.proxy(this, 'next'));
		$element.on('click', 'button.previous', $.proxy(this, 'previous'));

		$(window).on('unload', $.proxy(this, 'showWarning'));
	},

	onAnswerChange: function (e) {
		var didYouKnow = $(e.target).data('did-you-know');

		// if a DYK is present, show it
		if (didYouKnow) {
			this.updateDidYouKnow(didYouKnow);
		}

		// uncheck any answers to questions we're not on yet
		this.$element.find('.question :checked :gt(' + (this.currentQuestion-1) + ')').prop('checked', false);

		// update the grid
		this.filterResults();

	},

	filterResults: function () {
	  console.log('CALL: filterResults()');
	  console.log('CURRENT QUESTION INDEX: ' + this.currentQuestion);

	  // only grab results for answers for the current question and before
		var answers = this.$element.find('.question :checked :lt(' + this.currentQuestion + ')');
		this.resetProducts();

		// if we have answers we should filter
		if (!!answers.length) {
		  this.disableProducts();

		  // gather all the results into a set
		  var answerSet = new Array();
		  var newActiveProducts = new Array();
		  var data;

		  // create a temp variable to point to the this scope
		  var that = this;

		  // iterate through each answer
		  $.each(answers, function(index) {
		    // store the products to keep active
  		  data = $(answers[index]).data('results').split(' ');
  		  answerSet.push(data);

  		  // IF this is the first question
  		  // OR there aren't any active products
  		  // THEN set activeProducts to the current set of answers (should always be the first set)
  		  if (that.currentQuestion == 1 || !that.activeProducts.length) {
    		  // ADD
    		  that.activeProducts = answerSet[index];

  		  } else {
    		  // ELIMINATE
    		  $.each(that.activeProducts, function(k) {
      		  if ($.inArray(that.activeProducts[k], answerSet[index]) >= 0) {
        		  newActiveProducts.push(that.activeProducts[k]);
      		  }
    		  });
    		  that.activeProducts = newActiveProducts;
    		  newActiveProducts = new Array();

  		  } // if (that.currentQuestion == 1 || !that.activeProducts.length) {

		  }); // $.each(answers, function(index) {

		  // iterate through the set removing disabled classes on grid
		  this._debugAnswerSetReset();
		  this.disableProducts();
		  this.showActiveProducts(this.activeProducts);
		  this.updateResultsPage(this.activeProducts);

		  // reset this.activeProducts so we're always starting clean
		  this.activeProducts = new Array();

		} // if (!!answers)

	},

	showActiveProducts: function(products) {
	  var that = this;

    $.each(products, function(index) {
  	  $('.grid li[data-code="' + products[index]  + '"]').removeClass('disabled');
  	  that._debugAnswerSet(products[index]);
    });

	},
	disableProducts: function() {
  	this.$products.addClass('disabled');

	},
	resetProducts: function() {
  	this.$products.attr('class', '');

	},
	resetResultsPage: function() {
  	this.$results.removeClass('enabled');

	},
	_debugAnswerSet: function(string) {
  	$('#debug .answer-set').append('<p>' + string + '</p>');

	},
	_debugAnswerSetReset: function() {
  	$('#debug .answer-set').html('');

	},

	startOver: function () {
		this.$element.find(':checked').prop('checked', false);
		this.hideQuestions();
		this.showQuestion(1);

	},

	updateResultsPage: function(products) {
  	console.log('CALL: updateResultsPage(products)');

  	this.resetResultsPage();

  	$.each(products, function(index) {
    	$('#results .rv[data-code="' + products[index] + '"]').addClass('enabled');
  	});

	},
	updateDidYouKnow: function (index) {
	  console.log('CALL: updateDidYouKnow(' + index + ')');

	  var nextDYK = $('.did-you-knows .item[data-id="' + index + '"]').get(0);

	  if (!!nextDYK) {
  	  // hide all
  	  $('.did-you-knows .item').hide();

  	  // show the proper did-you-know
  	  $('.did-you-knows .item[data-id="' + index + '"]').show(); 
	  }

	},
	
	hideQuestions: function() {
  	console.log('CALL: hideQuestions()');
  	this.questions.each(function(){ $(this).hide(); });

	},
	showQuestion: function (index) {
	  console.log('CALL: showQuestion(' + index + ')');

	  this.filterResults();
		this.setCurrentQuestion(index); // index: 1-based index
		this.hideQuestions();

		var $question = this.getCurrentQuestion();
		$question.show();

		this.updateDidYouKnow($question.data('did-you-know'));

	},
	getCurrentQuestion: function() {
  	return $('#q' + this.currentQuestion);

	},
	setCurrentQuestion: function(index) {
  	this.currentQuestion = index;

  	if (this.currentQuestion == 1) {
    	this.$element.removeClass(function(){
      	return 'first last';
    	}).addClass('first');

  	} else if ((this.currentQuestion > 1) && (this.currentQuestion < this.questions.length)) {
    	this.$element.removeClass(function(){
      	return 'first last';
    	});

  	} else if (this.currentQuestion == this.questions.length) {
    	this.$element.removeClass(function(){
      	return 'first last';
    	}).addClass('last');

  	} // if (this.currentQuestion == 1)

	},
	incrementCurrentQuestionCount: function(increment) {
  	console.log('CALL: incrementCurrentQuestionCount(' + increment + ')');

  	this.currentQuestionCount = this.currentQuestionCount + increment;
  	this.$currentQuestionCounter.html(this.currentQuestionCount);

	},
	next: function () {
		console.log('CALL: next()');

		// check to make sure the current question has been answered
		var $question = this.getCurrentQuestion();
		var $answered = $question.find(':checked');

		if (!!$answered.get(0)) {
  		// determine the (1-based)index of the next question
  		// .data('next-question') will return qN, where N = our (1-based) index
  		var nextQuestion = $answered.data('next-question').substr(1);
  		this.incrementCurrentQuestionCount(1);
  		this.showQuestion(nextQuestion);

		}
	},
	previous: function () {
		var index = this.currentQuestion;
		var backedUp = false; // have we truly backed up to the last answered question?

		do {
  		index = index - 1;
  		backedUp = $('#q' + index).find(':checked').get(0);

		} while ( !!backedUp == false );

		if (index >= 0) {
		  this.incrementCurrentQuestionCount(-1);
			this.showQuestion(index);

		}

	},
	
	showWarning: function () {
		console.log('CALL: showWarning');
		//var response = confirm('Are you sure you want to lose your changes?');
	}
};

var step = new StepThrough('#grv-selector-container');
//var selector = new RVSelector('#selector');