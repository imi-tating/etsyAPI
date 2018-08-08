var allTheReviews = "";
var someOfTheReviews = "";

function determineHighlightedReviews() {
  someOfTheReviews = "";
  var highlightedReviews = $('[data-clicked="orange"]').find("p").text();
  someOfTheReviews = highlightedReviews;
  console.log("HIGHLIGHTED REVIEWS:");
  console.log(highlightedReviews);
}

function toggleWordCloud() {
  if ($(".fa-cloud").attr("data-toggle") === "off") {
    $(".fa-cloud").attr("data-toggle", "on");
    determineHighlightedReviews();
    convertReviewsKeyWords();
  } else {
    $(".fa-cloud").attr("data-toggle", "off");
    $("#word-cloud").empty();
  }
}

//
function toggleHelper() {
  if ($(".fa-question-circle").attr("data-toggle") === "off") {
    $(".fa-question-circle").attr("data-toggle", "on");
    alert("Click on cards below to highlight. This will limit the Word Cloud results to only include those reviews.");
    //consider pop-up modal with tips for using the site
  } else {
    $(".fa-question-circle").attr("data-toggle", "off");
  }
}

function togglePatreon() {
  if ($(".fa-patreon").attr("data-toggle") === "off") {
    $(".fa-patreon").attr("data-toggle", "on");
    $("#alerts").addClass("alert alert-dark");
    $("#alerts").append('<p>Want to support us & keep us working on new projects? <a href="https://www.patreon.com/parkerandleigh" target=_blank class="alert-link">Visit our Patreon here.</a></p>');
  } else {
    $(".fa-patreon").attr("data-toggle", "off");
    $("#alerts").removeClass("alert alert-dark").empty();
  }
}


function shareContent() {
  html2canvas(document.getElementById("word-cloud")).then(function(canvas) {
    var imageData = canvas.toDataURL("image/png")
	$("<img>").attr("src", imageData).attr("style", "height: 540px").appendTo($("body"))
});
}

function convertShopNameToUserId(etsyStoreName) {
  var queryURL = "https://openapi.etsy.com/v2/shops.js?api_key=jh254t145a6wj2f9518tpu54&shop_name=" + etsyStoreName + "&limit=3"

  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "jsonp"
  }).then(function(response){
    if(!response.ok) {
      $("#word-cloud").text("Something's Broken! Try Again Later.");
      return
    }
    console.log("SHOPS FOUND:");
    console.log(response.results);
    var foundShopName = response.results[0].shop_name;
    var shopURL = response.results[0].url;

    console.log("NEED TO ACCOUNT FOR NO SHOP FOUND:");
    console.log(response);
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

function cleanUpReviews(text) {
  return text.replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/ !/g, '!');
}

function cleanUpForWordCloud(text) {
  return text.replace(/"/g, "")
             .replace(/\./g, " ")
             .replace(/,/g, "")
             .replace(/'/g, "")
             .replace(/’/g, "")
             .replace(/!/g, " ")
             .replace(/…/g, "")
             .replace(/\?/g, "")
             .replace("  ", " ");
             // .replace(/[^\w\s]/gi, '') /*only if I want letters only*/
}

function findReviews(userId) {
  var queryURL = "https://openapi.etsy.com/v2/users/"+ userId + "/feedback/from-buyers.js?api_key=jh254t145a6wj2f9518tpu54&limit=100"

  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "jsonp"
  }).then(function(response){
    if(!response.ok) {
      $("#word-cloud").text("Something's Broken! Try Again Later.");
      return
    }
    showReviews(response.results)
  })
}

function showReviews(reviewArray) {
  $("#main-content").empty();
  $("#uhoh").empty();
  allTheReviews = "";
  someOfTheReviews = "";
  $("#word-cloud").empty();
  $(".fa-cloud").attr("data-toggle", "off");
  $(".fa-question-circle").attr("data-toggle", "off");
  $(".fa-patreon").attr("data-toggle", "off");


  if (reviewArray.length === 0) {
    $("#uhoh").html('<div class="card p-3 text-right uhoh" ><div class="blockquote mb-0"><p>Sadly, there are no reviews to display.<br>Perhaps you can be the first!<p><hr><div class="footer lead text-muted">(this does require making a purchase from their shop)<div></div></div>');
  } else {
    for(var i = 0; i < reviewArray.length; i++){
      if(reviewArray[i].message) {
        var review = " " + reviewArray[i].message;
        review = cleanUpReviews(review);
        var newCard = $('<div class="card p-3 text-right clickable">');
        newCard.attr("data-clicked", "gray");
        var newBlockQuote = $('<div class="blockquote mb-0">');
        var newP = $('<p>');

        newP.text(review);
        newBlockQuote.append(newP);
        newCard.append(newBlockQuote);
        $("#main-content").append(newCard);

        allTheReviews += review + " ";
      }
    }
  }
  console.log("STRING OF ALL REVIEWS:");
  console.log(allTheReviews);
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
  var text;
  if(someOfTheReviews == "") {
    text = cleanUpForWordCloud(allTheReviews);
    alert("Using all reviews");
  } else {
    text = cleanUpForWordCloud(someOfTheReviews);
    alert("Using only highlighted reviews");
  }

  var keyWords = text.toLowerCase();
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
  console.log("WORDS COUNTED:");
  console.log(wordsCounted);

  var arrayOfObjects = [];
  for(var word in wordsCounted) {
    arrayOfObjects.push({ key: word, value: wordsCounted[word] });
  }

  arrayOfObjects.sort(function (a, b) {
    return b.value - a.value
  })

  var slicedArray = arrayOfObjects.slice(0,300);

  generateWordCloud(slicedArray);
}

function generateWordCloud(wordCountObjects) {
  var colorFill = d3.scale.ordinal()
    .domain([1, 2, 3, 4, 5])
    .range(["#EF4D09", "#FF6C0A", "#505A63", "#CCC", "#FF7D00"]);
  var fill = colorFill;

  var w;
  if(window.innerWidth < 600) {
    w = window.innerWidth
  } else {
    w = 540;
  }
  // var w = window.innerWidth,
  //       h = window.innerWidth;
  var h = w;
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
        .attr("width", w)
        .attr("height", h)
        .attr("id", "word-cloud-svg");

  var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

  update();

  if(window.attachEvent) {
    window.attachEvent('onresize', update);
  }
  // else if(window.addEventListener) {
  //     window.addEventListener('resize', update);
  // }

  function draw(data, bounds) {
      // var w = window.innerWidth,
      //       h = window.innerWidth;

      svg.attr("width", w).attr("height", w);
      // svg.attr("viewBox", "0 0 700 700");

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
    layout.font('impact, AvenirNextCondensed-Heavy').spiral('archimedean');
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
  });

  $(document).on("click", ".card", turnMeEtsyOrange);
  $(document).on("click", ".fa-cloud", toggleWordCloud);
  $(document).on("click", ".fa-question-circle", toggleHelper);
  $(document).on("click", ".fa-patreon", togglePatreon);




});
