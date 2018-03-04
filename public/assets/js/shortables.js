$(function() {
// $(document).ready(function() {
  
  $("#new_post_submit").on("click", addShortable);

  function addShortable(ev){
    ev.preventDefault();
    var shortable = {
      title: $("#title_input").val().trim(),
      content: $("#content_input").val().trim(),
      published: $('#publish').is(":checked")
    };
    // console.log("trying to create new post:"+JSON.stringify(shortable));
    //!!!validate input
    $.ajax("/api/shortable/add", {
      type: "POST",
      data: shortable

    }).then( function(){
        window.location.pathname = "/api/shortables/all";
    });
  }

  function getAllShortables(){
    $.get( "/api/shortables/all" ).then( function(shortables){
      console.log(JSON.stringify(shortables));
    });    
  }

  function getPopularShortables(period){
    if( Array.contains(['day','month','week'], period ) ){
      period = ':'+perod;
    }
    else period = '';

    $.get( "/api/shortables/popular/"+period ).then( function(shortables){
      console.log(JSON.stringify(shortables));
    });    
  }

  function getShortablesByAuthor(authorId){
    if(authorId){
      $.get( "/api/shortables/author/:"+authorId ).then( function(shortables){
        console.log(JSON.stringify(shortables));
      }); 
    }else{
      console.log("ERROR: No AuthorId");
    }
  }

  function getMyShortables(){
      $.get( "/api/shortables/owner" ).then( function(shortables){
        console.log(JSON.stringify(shortables));
      }); 
  }

});
