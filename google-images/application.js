$(document).ready(function() {
    var ourStories;

    function OurStories (element) {
        this.breakpoint          = 0;
        this.slideEasing         = 'linear';
        this.$element            = $(element);
        this.infoPanel           = '#infoPanel';
        this.lastBreakpoints     = [];
        this.perRow              = 0;
        this.rowBreakpointsArray = [];
        this.slideDuration       = 250;
        this.story               = '.story';
        this.$stories            = this.$element.find(this.story);

        this._init();
    }

    OurStories.prototype = {
        _init: function () {
            this._setupEventListeners();
            this.getOffSets();
            this.findPerRow();

            //setInterval($.proxy(this, '_debugStuff'), 250);
        },
        _debugStuff: function () {
            $('#debug span em.bps').html(this.rowBreakpointsArray.join(', '));
            $('#debug span em.lbps').html(this.lastBreakpoints.join(', '));
            $('#debug span em.lbp').html(this.breakpoint);
            $('#debug span em.pr').html(this.perRow);
        },
        _setupEventListeners: function () {
            var $element = this.$element;

            $(window).on('resize', this.throttle($.proxy(this, 'doResizeTasks'), 25));
            $($element).on('click', '.story a', $.proxy(this, 'clickStory'));
            $($element).on('click', '#infoPanel', $.proxy(this, 'clickClosePanel'));
        },
        clickStory: function (e) {
            e.preventDefault();

            var $story = $(e.currentTarget).parent();
            var index  = this.$stories.index($story);
            var $panel = this.$element.find(this.infoPanel);
            var bp     = this.breakpoint;

            //console.log('clickStory: panel = ', $panel);

            if (!this.isInfoPanelVisible()) {
                //console.log(1);
                this.insertPanel(index); // open
                this.populatePanel(); // populate

            } else if (this.isInfoPanelVisible() && ($panel.data('for') == index)) {
                //console.log(2);
                $panel.trigger('click'); // close

            } else if (this.isInfoPanelVisible() && (bp == this.findBreakpoint(index))) {
                //console.log(3);
                this.updatePanel(index);
                this.populatePanel();

            } else if (this.isInfoPanelVisible() && (bp !== this.findBreakpoint(index))) {
                //console.log(4);
                $panel.trigger('click'); // close
                this.insertPanel(index); // open
                this.populatePanel(); // populate

            } else {
                //console.log(5);

                $panel.trigger('click'); // close
                this.insertPanel(index); // open
                this.populatePanel(); // populate
            }
        },
        clickClosePanel: function (e) {
            $(e.currentTarget).slideUp(this.slideDuration, this.slideEasing, function () {
                $(this).remove();
            });
        },
        didBreakpointsChange: function () {
            if (($(this.lastBreakpoints).not(this.rowBreakpointsArray).length == 0 && $(this.rowBreakpointsArray).not(this.lastBreakpoints).length == 0)) {
                return false;
            }

            return true;
        },
        doResizeTasks: function () {
            this.getOffSets();
            this.findPerRow();

            if (this.isInfoPanelVisible() === true && this.didBreakpointsChange() === true) {
                this.movePanel();
            }

            this.lastBreakpoints = this.rowBreakpointsArray;
        },
        findBreakpoint: function (num) {
            var arr = this.rowBreakpointsArray;
            var i;

            for (i = 0; i < arr.length; i++) {
                if (num < arr[i]) {
                    this.breakpoint = arr[i];
                    return arr[i];
                }
            }

            return 0;
        },
        findBreakpointDifferenceFrequencies: function (differencesArray) {
            return differencesArray.reduce(function (acc, curr) {
                if (typeof acc[curr] == 'undefined') {
                    acc[curr] = 1;
                } else {
                    acc[curr] += 1;
                }

                return acc;
            }, {});
        },
        findBreakpointDifferences: function () {
            var array = this.rowBreakpointsArray;
            var differences = [];

            for (i = 0; i < array.length-1; i++) {
                r = Math.abs((array[i] - array[i+1]));

                differences.push(r);
            }

            return differences;
        },
        findMostFrequentBreakpointDifference: function (resultsObject) {
            var mostFrequent, name;

            for (name in resultsObject) {
                if (resultsObject.hasOwnProperty(name)) {
                    if (typeof mostFrequent == 'undefined') {
                        mostFrequent = name;
                    } else {
                        if (mostFrequent < name) {
                            mostFrequent = name;
                        }
                    }
                }
            }

            return parseInt(mostFrequent);
        },
        findPerRow: function () {
            var differences = this.findBreakpointDifferences(); // returns array
            var results = this.findBreakpointDifferenceFrequencies(differences); // returns object
            this.perRow = this.findMostFrequentBreakpointDifference(results); // returns number

            return this.perRow;
        },
        getOffSets: function () {
            var first  = this.$element.find(this.story + ':first').offset().left;
            var offset = 0;
            var count  = 0;
            var breakpoints = [];

            this.$element.find(this.story).each(function () {
                offset = $(this).offset().left;

                if (count > 0 && offset == first) {
                    breakpoints.push(count);
                }

                count++;
            });

            this.rowBreakpointsArray = breakpoints;
        },
        insertPanel: function (index) {
            var insertPoint = this.findBreakpoint(index);
            var html        = '<div id="infoPanel" data-for="' + index + '"></div>';

            $(this.infoPanel).each(function () {
                $(this).remove();
            });

            this.placePanel(insertPoint, html);

            var $panel = this.$element.find(this.infoPanel);
            $panel.slideDown(this.slideDuration, this.slideEasing);
        },
        isInfoPanelVisible: function () {
            return this.$element.find(this.infoPanel).is(':visible');
        },
        movePanel: function () {
            var i, $panel, panel, panelId, storyCount;
            var canGoNoFurther = false;
            i = 0;

            $panel = $(this.infoPanel);
            panelId = $panel.data('for');

            do {
                i+=this.perRow;

                if (panelId < i) {
                    canGoNoFurther = true;
                }

            } while ( canGoNoFurther === false );

            panel = $panel.detach();
            this.placePanel(i, panel);
        },
        placePanel: function (index, panel) {
            var storyCount = this.$stories.size();

            if (index >= storyCount) {
                this.$element.find(this.story + ':last').after(panel);
            } else if (index > 0) {
                this.$element.find(this.story + ':eq(' + index + ')').before(panel);
            } else {
                this.$element.find(this.story + ':last').after(panel);
            }
        },
        populatePanel: function () {
            var $panel = this.$element.find(this.infoPanel);

            $panel.html('<h1>' + $panel.data('for') + '</h1>');
        },
        throttle: function(fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },
        updatePanel: function (index) {
            var $panel = this.$element.find(this.infoPanel);

            $panel.data('for', index);
        }
    };

    ourStories = new OurStories ('#stories');
});

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(accumulator){
        if (this===null || this===undefined) throw new TypeError("Object is null or undefined");
        var i = 0, l = this.length >> 0, curr;

        if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
            throw new TypeError("First argument is not callable");

        if(arguments.length < 2) {
            if (l === 0) throw new TypeError("Array length is 0 and no second argument");
            curr = this[0];
            i = 1; // start accumulating at the second element
        }
        else
            curr = arguments[1];

        while (i < l) {
            if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
            ++i;
        }

        return curr;
    };
}