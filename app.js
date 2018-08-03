function findReviews(etsyStore) {
  var queryURL = "https://openapi.etsy.com/v2/users/"+ etsyStore + "/feedback/from-buyers?api_key=jh254t145a6wj2f9518tpu54&limit=100"
  // "https://openapi.etsy.com/v2/users/imitating/feedback/from-buyers?api_key=jh254t145a6wj2f9518tpu54&limit=100"

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    console.log(response);
    showReviews(response.results)
  })
}

function showReviews(reviewArray) {
  $("#main-content").empty();
  for(var i = 0; i < reviewArray.length; i++){
    if(reviewArray[i].message) {
      var newCard = $('<div class="card p-3 text-right">');
      newCard.attr("data-clicked", "gray");
      var newBlockQuote = $('<div class="blockquote mb-0">');
      var newP = $('<p>');
      newP.text(reviewArray[i].message);

      newBlockQuote.append(newP);
      newCard.append(newBlockQuote);
      $("#main-content").append(newCard);
    }
  }
}

function turnMeEtsyOrange(){
  if ($(this).attr("data-clicked") === "gray") {
    $(this).css("border-color", "rgb(239, 77, 9)");
    $(this).attr("data-clicked", "orange");
  } else if ($(this).attr("data-clicked") === "orange") {
    $(this).css("border-color", "rgba(0,0,0,.125)");
    $(this).attr("data-clicked", "gray");
  }
}




$(document).ready(function(){
  findReviews("imitating");

  $("#shop-name-button").click(function(){
    // event.preventDefault();
    var shopName = $("#user-input").val().trim();
    findReviews(shopName);
    $("#shop-being-viewed").text("Shop Being Viewed: " + shopName);
    $("#user-input").val("");


  });




  $(document).on("click", ".card", turnMeEtsyOrange)


});
