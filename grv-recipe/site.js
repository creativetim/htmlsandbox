$(document).ready(function(){
  // Initiate season
  var defaultSeason = 'summer';
  var classes = ($("body").attr("class") ? $("body").attr("class") : '');

  if (classes.match(/^(winter|spring|summer|fall)$/)) {
    $("#tabs").addClass(classes);
  } else {
    $("#tabs").addClass(defaultSeason);
  }

  // Initialize $.address()
  $.address.strict(false).wrap(true);

  // Set default season
  if ($.address.value() == '') {
    $.address.history(false).value(defaultSeason + '-breakfast').history(true);
  } else {
    // Parse the hash and set up the appropriate state
    var hash = $.address.value();
    var match = hash.match(/^(winter|spring|summer|fall)(?:-(\w+))?$/); // match[1] = season; match[2] = type | undefined
    var season = '';
    var type = '';

    // If we got anything back from our RegEx let's set up the appropriate state
    if (match) {
      season = match[1];
      type = (match[2] ? match[2] : '');

      // What season do we have to "remove", if at all?
      var remove = $("#tabs").attr("class").match(/(winter|spring|summer|fall)$/)[1];

      // Remove the current class on #tabs if it doesn't match the provided season
      if (remove !== season) {
        $("#tabs").removeClass(remove).addClass(season); 
      }

      // Trigger regular Click event handler
      if (type) {
        // If type is promo we have to ensure there are any recipes there otherwise we default to breakfast
        if (type == 'promo' && !$('#tabs ul li[class="promo"]').children().length) {
          type = 'breakfast';
          $.address.value( $.address.value().replace('promo', 'breakfast'));
        }
        $('#tabs ul li[class="' + type + '"]').triggerHandler('click');
      }
    } // if (match)
  } // if ($.address.value() == '')

  // When user changes seasons
  $("#season-select li a").click(function(e){
    e.preventDefault();

    // Update deep-linking assuming it's different from the current
    if ($.address.value() !== $(this).attr("href").replace(/^#/, '') + '-breakfast') {
      $.address.value($(this).attr("href").replace(/^#/, '') + '-breakfast'); // Also setting the default tab

      // Fire-off GA event
      console.log("Fire GA event: " + $(this).attr("href").replace(/^#/, '') + '-breakfast');
    }

    // What "season" are we changing to and what season do we have to "remove"?
    var season = $(this).attr("class");
    var remove = $("#tabs").attr("class").match(/(winter|spring|summer|fall)$/)[1];

    // Remove class if we found one (could be blank) and add the new season class
    $("#tabs").removeClass(remove).addClass(season);

    // Trigger regular Click event handler for default tab
    $('#tabs ul li[class="breakfast"]').triggerHandler('click');
  });

  // When user changes type update the address
  $("#tabs ul li").click(function(e){
    var season = $.address.value().match(/(winter|spring|summer|fall)/)[1];
    var category = ($(this).attr("class") ? '-' + $(this).attr("class") : '');
    category = category.replace(/\s(\bactive\b)?/,"");

    // Ensure we're not already where we need to be to avoid mucking up the user's history
    if ($.address.value() !== season + category){
     $.address.value(season + category);

     // If category is promo we need to grab the actual name of the promo to send to GA
     if (category == '-promo') {
       category = '-' + $(this).text();
     }

     // Fire-off GA event
     console.log("Fire GA event: " + season + category);
    }
  });
});