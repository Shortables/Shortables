$(function() {
// $(document).ready(function() {
  
  $("#new_post_submit").on("click", addShortable);
  $("#shortables-list").on("click", ".vote", vote);
  $("#shortables-list").on("click", ".fav_toggle", toggleFavorites);
  $("#shortables-list").on("click", ".publish_toggle", togglePublished);

  $(".short-title").on("click", show_shortable);

// <button class="vote_up" data-id="{{post.id}}">Up</button>
  function addShortable(ev){
    ev.preventDefault();
    let shortable = {
      title: $("#title_input").val().trim(),
      content: $("#content_input").val().trim(),
      published: $('#publish').is(":checked")
    };
    console.log("trying to create new post:"+JSON.stringify(shortable));
    //!!!validate input
    $.ajax("/api/shortable/add", {
      type: "POST",
      data: shortable

    }).then( function(){
        window.location.pathname = "/api/shortables/all";
    });
  }

  function toggleFavorites(){
    let post_id = $(this).data("id");
    let fav = $(this).data("fav");
    let user_action = (!fav)? "add" : "delete";
    $.ajax("/api/shortable/favorites/" + post_id, {
      type :"PUT",
      data : { action: user_action }
    }).then( function(){
      location.reload();
    });
  }
  
  function togglePublished(){
    let post_id = $(this).data("id");
    let pub = $(this).data("pub");
    if(pub){
      $.ajax("/api/shortable/unpublish/" + post_id, {
        type :"PUT"
      }).then( function(){
        location.reload();
      });      
    }
    else{
      $.ajax("/api/shortable/publish/" + post_id, {
        type :"PUT"
      }).then( function(){
        location.reload();
      });
    }
  }
  
  function vote(){
    let post_id = $(this).data("id");
    let user_vote = $(this).data("vote");

    $.ajax("/api/shortable/vote/" + post_id, {
      type : "PUT",
      data : { vote: user_vote }
    }).then(function() {
      location.reload();
    });
  }

  function show_shortable(){
    let post_id = $(this).data("id");
    console.log(post_id);
    $("#short_title").empty();
    $("#short_content").empty();
    $.get("/api/shortable/"+post_id, function(data){
      console.log(data);
      if(data){
        $("#short_title").text(data.title);
        $("#short_content").text(data.content);
        $("#shortable-modal").modal("toggle");
      }
    }); 
  }

});
