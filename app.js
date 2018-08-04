function convertShopNameToUserId(etsyStoreName) {
  var queryURL = "https://openapi.etsy.com/v2/shops?api_key=jh254t145a6wj2f9518tpu54&shop_name=" + etsyStoreName + "&limit=3"

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){

    console.log("LOOK HERE!");
    console.log(response);
    console.log(" ");
    console.log("SHOPS FOUND:");
    console.log(response.results);
    console.log("USER ID:");
    console.log(response.results[0].user_id);

    var foundShopName = response.results[0].shop_name;
    var shopURL = response.results[0].url;

    // if (response.count == 0) {
    //   alert("shop not found");
    // } else {
    //   var newLink = $('<a>').attr("href", shopURL)
    //   newLink.attr("target", "_blank");
    //   newLink = newLink.text("Shop Being Viewed: " + foundShopName);
    //   $("#shop-being-viewed").empty();
    //   $("#shop-being-viewed").append(newLink);
    //   findReviews(response.results[0].user_id)
    // }


    var newLink = $('<a>').attr("href", shopURL)
    newLink.attr("target", "_blank");
    newLink = newLink.text("Shop Being Viewed: " + foundShopName);
    $("#shop-being-viewed").empty();
    $("#shop-being-viewed").append(newLink);

    findReviews(response.results[0].user_id);

  })

}

function findReviews(userId) {

  var queryURL = "https://openapi.etsy.com/v2/users/"+ userId + "/feedback/from-buyers?api_key=jh254t145a6wj2f9518tpu54&limit=100"
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
  convertShopNameToUserId("imitating");

  $("#shop-name-button").click(function(){
    // event.preventDefault();
    var shopName = $("#user-input").val().trim();

    convertShopNameToUserId(shopName);
    $("#user-input").val("");

  });




  $(document).on("click", ".card", turnMeEtsyOrange)


});
