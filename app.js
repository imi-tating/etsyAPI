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

    // if (response.count === 0) {
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
  $("#uhoh").empty();

  if (reviewArray.length === 0) {
    $("#uhoh").html('<div class="card p-3 text-right uhoh" ><div class="blockquote mb-0"><p>Sadly, there are no reviews to display.<br>Perhaps you can be the first!<p><hr><div class="footer lead text-muted">(this does require making a purchase from their shop)<div></div></div>');
  } else {
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

}

function turnMeEtsyOrange() {
  if ($(this).attr("data-clicked") === "gray") {
    $(this).css("border-color", "rgb(239, 77, 9)");
    $(this).attr("data-clicked", "orange");
  } else if ($(this).attr("data-clicked") === "orange") {
    $(this).css("border-color", "rgba(0,0,0,.125)");
    $(this).attr("data-clicked", "gray");
  }
}

function generateWordCloud() {
  // var wordCloudText = "Great quality and great customer service. Perfect! Just what we wanted!! Absolutely LOVE these sea turtles!! Awesome customer service, and shipping was prompt. I highly recommend this shop! Thank you again so much for my little grouping! LOVE these turtles! Great customer service, and fast shipping! Highly recommend this shop! Well be buying again! I had such a pleasant experience ordering from this shop! I sent several messages with questions/requests, and always had a reply within minutes. I really feel the owners go above and beyond to make sure the customer is happy. Communication was always very friendly, and my kids had a great time customizing the size and colour of their dinosaurs. The extra goodies and hand written note were a really nice touch, thank you. Application was also very easy! This is definitely going to be my go-to any time I want to purchase decals! Wonderful seller to work with! Went above and beyond to get the decals to me in time for Christmas. Gift recipient loved them!! Highly recommend this seller. Easy ordering and fast shipping. The colors are vibrant and pop against the color of our car. Seller included extra tiny decals so we got to test applications before the real one. I really appreciated that extra touch and my son loves that he got a tiny green dinosaur on his window. Received early and was everything I expected and more! Thanks again! The decal came FAST. It was well-made with attention to detail and the instructions for how to install it on my laptop were top notch. Would buy from this store again in a heart beat! Love these decals soooo much!! I love this!!!! Thank you An amazing job.. Exactly what I asked for…. Adorable!!! Thank you Love them! They come quick shipping time and the owners go above and beyond Looks great, easy to apply. Was a gift, and the recipient loves it."


}


$(document).ready(function(){
  convertShopNameToUserId("imitating");
  // generateWordCloud("Thank you An amazing job Exactly what I asked. Adorable! Thank you Love them!");

  $("#shop-name-button").click(function(){
    // event.preventDefault();
    var shopName = $("#user-input").val().trim();

    convertShopNameToUserId(shopName);
    $("#user-input").val("");

  });




  $(document).on("click", ".card", turnMeEtsyOrange)
  $(document).on("click", "#cloud-button", generateWordCloud)


});
