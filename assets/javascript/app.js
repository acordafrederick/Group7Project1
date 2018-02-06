function searchBandsInTown(artist) {
    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Printing the entire object to console
      console.log(response);
      // Constructing HTML containing the artist information
      var artistName = $("<h1>").text(response.name);
      var artistURL = $("<a>").attr("href", response.url).append(artistName);
      var artistImage = $("<img>").attr("src", response.thumb_url);
      var trackerCount = $("<h2>").text(response.tracker_count + " fans tracking this artist");
      var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " upcoming events");
      var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");
      // Empty the contents of the artist-div, append the new artist content
      $("#artist-div").empty();
      $("#artist-div").append(artistURL, artistImage, trackerCount, upcomingEvents, goToArtist);
    });
  }
  // Event handler for user clicking the select-artist button
  $("#select-artist").on("click", function(event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputArtist = $("#artist-input").val().trim();
    // Running the searchBandsInTown function (passing in the artist as an argument)
    searchBandsInTown(inputArtist);
  });


// io09K9l3ebJxmxe2 test SongKick API Key
var apiKeySongKick = "io09K9l3ebJxmxe2";
var todaysDate = moment().format("YYYY-MM-DD");
console.log(todaysDate);

// google maps geolocation api AIzaSyCMYSEdplA8YCDESSjE-KxOji84lQjKNTU
var apiKeyGoogleGeoLocate = "AIzaSyCMYSEdplA8YCDESSjE-KxOji84lQjKNTU";

// google maps directions api AIzaSyCnd-IWrCKGW-QzK2iM3opYUL7Z_0gaR3A
var apiKeyGoogleDirections = "AIzaSyCnd-IWrCKGW-QzK2iM3opYUL7Z_0gaR3A";

// google maps distance matrix api AIzaSyC4VTDL8HDsd-eNs_89_lBzicvSKZAaWa0
var apiKeyGoogleMatrix = 'AIzaSyC4VTDL8HDsd-eNs_89_lBzicvSKZAaWa0';

// Global initialized Variables
//  - Songkick -
var cityGPS = '';
var eventResults = [];

//  - Google Maps -
var distanceResults = [];


// google maps object

var googleMaps = {
  findDistance: function(origin, location1, location2, location3, location4, location5, location6, locaiton7, location8, location9, location10){
      // make an array of locations from our function arguments, remove the first entry because it is the origin
      var destinations = Array.from(arguments);
      destinations.shift();
      console.log(destinations);


      var origins = origin;


      var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + origins + "&destinations=" + destinations + "6&key=" + apiKeyGoogleMatrix;

      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
          console.log(response);
          console.log(response["rows"]);
          console.log(response["rows"][0]["elements"][0]["distance"]);
          console.log(response["rows"][0]["elements"][0]["duration"]);
          distanceResults = [];



        });

    },


};



//songkick object for function storage

var songkick = {

  // find GPS of a city using a search based on "cityname" string. Updates global var gps.
  findCityGps: function(location){
      var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?query=" + location + "&apikey=" + apiKeySongKick;
      // var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?location=clientip&apikey=io09K9l3ebJxmxe2";


      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        // console.log(response);
        // store AJAX request data in a results variable
        var lat = response["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];

        var long = response["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];

        cityGPS = lat + "," + long;
        console.log(cityGPS);
        // console.log(lat);
        // console.log(long);
        // console.log(gps.toString());

      });
    },




  // finds Events using GPS location for Today's Date
  findEvents: function(location){
      // var metroId = metroId;

      // Location needs to be in "lat,long" using positive and negative for north/south east/west
      // var gps = location;

      var gps = "geo:" + location;
      // var queryURL = "http://api.songkick.com/api/3.0/events.json?" + metroId + "/calendar.json?apikey=io09K9l3ebJxmxe2";
      var queryURL = "http://api.songkick.com/api/3.0/events.json?apikey=" + apiKeySongKick  + "&location=" + gps + "&per_page=15" + "&min_date=" + todaysDate + "&max_date=" + todaysDate;


      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        console.log(response);
        console.log(response["resultsPage"]["results"]["event"]);

        var eventArr = response["resultsPage"]["results"]["event"];

        eventResults = [];

        for (var i = 0; i < eventArr.length; i++) {
          var eventObj = {};
          eventObj.name = eventArr[i]["displayName"];
          eventObj.lat = eventArr[i]["location"]["lat"];
          eventObj.lng = eventArr[i]["location"]["lng"];
          eventObj.startTime = eventArr[i]["start"]["time"];
          eventObj.date = eventArr[i]["start"]["date"];
          eventObj.uri = eventArr[i]["uri"];
          eventObj.performers = eventArr[i]["performance"];


          eventResults.push(eventObj)


        };

        console.log(eventResults);

      });
      }

};

// Test Variables
var austinGPS = "30.3005,-97.7472";

songkick.findCityGps("austin");
songkick.findEvents(austinGPS);
