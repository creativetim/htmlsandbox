$(document).ready(function(){
  var content = $('#iframe');
  
  $('div.list > ul > li > a').click(function(e){
    e.preventDefault();
    var url = 'http://www.cnn.com/' + $(this).attr("href");
    content.attr("src", url);
    //content.load('get.php?url=' + url);
    
  });
});