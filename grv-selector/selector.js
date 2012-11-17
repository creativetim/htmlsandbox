// A B C TT 5thW EXP FCT TC

function RVSelector(element) {
  // setup intial properties
	this.currentQuestion = 1;
	this.currentQuestionCount = 1;
	
	this.$element = element = $(element);
	this.products = element.find('.rv-info');
	this.questions = element.find('.question');
	this.$currentQuestionCounter = element.find('.current-question span');

	// setup event listeners
	this._setupEventListeners();

	// initialize the tool
	this.startOver();
}

RVSelector.prototype = {
	_setupEventListeners: function () {
		var element = this.$element;
		
		element.on('change', ':radio', $.proxy(this, 'onAnswerChange'));
		element.on('click', 'button.next', $.proxy(this, 'next'));
		element.on('click', 'button.previous', $.proxy(this, 'previous'));
		
		$(window).on('unload', $.proxy(this, 'showWarning'));
	},
	
	onAnswerChange: function (e) {
		var didYouKnow = $(e.target).data('did-you-know');

		// if a DYK is present, show it
		if (didYouKnow) {
			this.updateDidYouKnow(didYouKnow);
		}

		this.filterResults();
	},
	
	filterResults: function () {
	  console.log('CALL: filterResults()');

		var $question = this.getCurrentQuestion();
		var result = $question.find(':checked').data('results');
		
		if (!!result) {
		
		  /*
		   * Ok, I need to gather all the questions that have been aswered
		   *   Disable all questions
		   *   Loop through each answer
		   *       Remove 'disabled' class for each item in the data-results
		   *
		   */
		
		
		  console.log('RESULT: ' + result);
		  console.log(typeof result);
  		//var results = $.map(result.split(' '), function (id) { return id; }).join(',');
  		var results = result.split(' ');
  		//console.log(typeof results);
  		//console.log(results.splice());
  		//console.log($('.grid ul li').not('li[data-code="TT"]'));
  		$('.grid ul li').each(function(){
    		$(this).addClass('disabled');
  		});
  		$.each(results, function(index){
    		$('.grid ul li[data-code="' + results[index] + '"]').attr('class', '');
  		});

  		// filter the grid
  		
  		
  		// filter the results panel
  		//this.products.filter(':not(' + resultsSelector + ')').addClass('disabled');
		}

	},
	
	startOver: function () {
		this.$element.find(':checked').prop('checked', false);
		this.hideQuestions();
		this.showQuestion(1);
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

		this.setCurrentQuestion(index); // index: 1-based index

		this.hideQuestions();

		var $question = this.getCurrentQuestion();
		$question.show();

		// display the associated did-you-know
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

  	} else if ((this.currentQuestion > 1) && (this.currentQuestion < this.questions.length + 1)) {
    	this.$element.removeClass(function(){
      	return 'first last';
    	});

  	} else if (this.currentQuestion == this.questions.length + 1) {
    	this.$element.removeClass(function(){
      	return 'first last';
    	}).addClass('last');
  	} // if (this.currentQuestion == 1)

	},
	setCurrentQuestionCount: function(increment) {
  	console.log('CALL: setCurrentQuestionCount(' + increment + ')');
  	console.log(this.currentQuestionCount, this);

  	this.currentQuestionCount = this.currentQuestionCount + increment;
  	console.log(this.currentQuestionCount);
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
  		this.setCurrentQuestionCount(1);
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
		  this.setCurrentQuestionCount(-1);
			this.showQuestion(index);
		}
	},
	
	showWarning: function () {
		console.log('CALL: showWarning');
		//var response = confirm('Are you sure you want to lose your changes?');
	}
};


var selector = new RVSelector('#selector');