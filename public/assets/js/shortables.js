$(function() {
// $(document).ready(function() {
  
  $("#new_post_submit").on("click", addShortable);
  $("#shortables-list").on("click", ".vote", vote);

// <button class="vote_up" data-id="{{post.id}}">Up</button>
  function addShortable(ev){
    ev.preventDefault();
    var shortable = {
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
  function addToFavorites(){
    return 0;
  }
  function deleteFromfavorites(){
    return 0;
  }
  function togglePublish(){
    return 0;
  }
  function vote(){
    var post_id = $(this).data("id");
    var user_vote = $(this).data("vote");

    $.ajax("/api/shortable/vote/" + post_id, {
      type: "PUT",
      data: { vote: user_vote }
    }).then(
      function() {
        location.reload();
      }
    );
  }

});
