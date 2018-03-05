$(function() {
// $(document).ready(function() {
  
  $("#new_post_submit").on("click", addShortable);
  $("#shortables-list").on("click", ".vote", vote);
  $("#shortables-list").on("click", ".fav_toggle", toggleFavorites);

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
    // <button class="fav_toggle" data-id="{{post.id}}" data-fav="{{post.fav}}">
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
  function togglePublish(){
    return 0;
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

});
