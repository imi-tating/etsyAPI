var allTheReviews = "";

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
  allTheReviews = "";

  if (reviewArray.length === 0) {
    $("#uhoh").html('<div class="card p-3 text-right uhoh" ><div class="blockquote mb-0"><p>Sadly, there are no reviews to display.<br>Perhaps you can be the first!<p><hr><div class="footer lead text-muted">(this does require making a purchase from their shop)<div></div></div>');
  } else {
    for(var i = 0; i < reviewArray.length; i++){
      if(reviewArray[i].message) {
        var newCard = $('<div class="card p-3 text-right">');
        newCard.attr("data-clicked", "gray");
        var newBlockQuote = $('<div class="blockquote mb-0">');
        var newP = $('<p>');

        newP.text(reviewArray[i].message.replace(/&#39;/g, "'"));
        newBlockQuote.append(newP);
        newCard.append(newBlockQuote);
        $("#main-content").append(newCard);

        allTheReviews += reviewArray[i].message.replace(/&#39;/g, "'");
      }
    }
  }
  console.log("All the reviews: " + allTheReviews);
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

function convertReviewsKeyWords() {
  var text = allTheReviews;
  // var convertApostrophyBack = text.replace(/&#39;/g, "'");
  var noPunctuation = text.replace(/[\.\!\,\']/g, "");
  // var removeWords = "a |an |the |and |this |that |these |those |he |his |her |hers |its |their |it |is |was |am |so |I |we |Id |my |you |your |yours |what |who |why |how |when |came |went |them |with |they |about |just |did |didnt |cant ";
  // var re = new RegExp(removeWords, "gi")
  // var keyWords = noPunctuation.replace(re,"");
  var keyWords = noPunctuation.toLowerCase();
  var arrayOfKeyWords = keyWords.split(" ").filter(function(eachWord) {
    return !stopWords.includes(eachWord);
  });

  generateKeyValuePairsObject(arrayOfKeyWords);
}

function generateKeyValuePairsObject(arrayOfWords) {
  var wordsCounted = arrayOfWords.reduce(function(current, next) {
    if(current[next]) /* if word doesn't exist in object yet, then do: */{
      current[next] += 1;
    } else {
      current[next] = 1;
    }
    return current;
  }, {} /* this is the "current"/starting point/object */ );
  console.log(wordsCounted);

  var arrayOfObjects = [];
  for(var word in wordsCounted) {
    arrayOfObjects.push({ key: word, value: wordsCounted[word] });
  }

  arrayOfObjects.sort(function (a, b) {
    return b.value - a.value
  })

  var slicedArray = arrayOfObjects.slice(0,300);

  console.log(slicedArray)
  generateWordCloud(slicedArray);
}

function generateWordCloud(wordCountObjects) {
  // $(".fa-cloud").click();
  // $("#word-cloud").append();
  var fill = d3.scale.category20b();
  var w = 800,
        h = 800;
  var max,
        fontSize;
  var layout = d3.layout.cloud()
        .timeInterval(Infinity)
        .size([w, h])
        .fontSize(function(d) {
            return fontSize(+d.value);
        })
        .text(function(d) {
            return d.key;
        })
        .on("end", draw);

  var svg = d3.select("#word-cloud").append("svg")
        // .attr("width", w)
        // .attr("height", h);

  var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

  update();

  if(window.attachEvent) {
    window.attachEvent('onresize', update);
  } else if(window.addEventListener) {
      window.addEventListener('resize', update);
  }

  function draw(data, bounds) {
      var w = 800,
            h = 800;

      svg.attr("viewBox", "0 0 700 700");

      scale = bounds ? Math.min(
              w / Math.abs(bounds[1].x - w / 2),
              w / Math.abs(bounds[0].x - w / 2),
              h / Math.abs(bounds[1].y - h / 2),
              h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

      var text = vis.selectAll("text")
              .data(data, function(d) {
                  return d.text.toLowerCase();
              });
      text.transition()
              .duration(1000)
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .style("font-size", function(d) {
                  return d.size + "px";
              });
      text.enter().append("text")
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .style("font-size", function(d) {
                  return d.size + "px";
              })
              .style("opacity", 1e-6)
              .transition()
              .duration(1000)
              .style("opacity", 1);
      text.style("font-family", function(d) {
          return d.font;
      })
              .style("fill", function(d) {
                  return fill(d.text.toLowerCase());
              })
              .text(function(d) {
                  return d.text;
              });

      vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
  }

  function update() {
    layout.font('impact').spiral('archimedean');
    fontSize = d3.scale['sqrt']().range([10, 100]);
    if (wordCountObjects.length){
        fontSize.domain([+wordCountObjects[wordCountObjects.length - 1].value || 1, +wordCountObjects[0].value]);
    }
    layout.stop().words(wordCountObjects).start();
  }



}


$(document).ready(function(){
  convertShopNameToUserId("imitating");

  $("#shop-name-button").click(function(){
    event.preventDefault();
    var shopName = $("#user-input").val().trim();

    convertShopNameToUserId(shopName);
    $("#user-input").val("");

    // convertReviewsKeyWords(allTheReviews);


  });

//Remove once button actions are implemented
  $(".fa-question-circle, .fa-at").click(function(){
    alert("Sorry! This button is still under construction. Check back soon for updates.");
  });


  $(document).on("click", ".card", turnMeEtsyOrange)
  $(document).on("click", ".fa-cloud", convertReviewsKeyWords)

});
