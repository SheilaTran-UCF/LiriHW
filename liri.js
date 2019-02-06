// // 
// require("dotenv").config();

// var keys = require("./keys");

// var axios = require("axios");

// var Spotify = require("node-spotify-api");

// var moment = require("moment");

// var fs =require("fs");

// let spotify = new Spotify(key.spotify);

// //-----------------------------//
// // this for search request //

// var search = "";

// DEPENDENCIES
// =====================================

// Read and set environment variables
require("dotenv").config();

// Import the API keys
var keys = require("./keys");

// Import the node-spotify-api package.
var Spotify = require("node-spotify-api");

// Import the axios npm package.
var axios = require("axios");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");
// console.log(keys.spotify);
// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// FUNCTIONS
// =====================================

// Writes to the log.txt file
var writeToLog = function(data) {
  // Append the JSON data and add a newline character to the end of the log.txt file
  fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err) {
    if (err) {
      return console.log(err);
    }
    // log.txt update info
    console.log("log.txt was updated!");
  });
};



//  function to get the artist name
var getArtistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "beautiful-life";
  }

  spotify.search({ 
    type: "track", 
    query: songName },
    
    function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }

    var songs = data.tracks.items;
    var data = [];

    for (var i = 0; i < songs.length; i++) {
      data.push({
        "Artist(s)"     : songs[i].artists.map(getArtistNames),
        "Song name: "   : songs[i].name,
        "Album: "       : songs[i].album.name,
        "Preview song: ": songs[i].preview_url
      });
    }

    console.log(data);
    writeToLog(data);
  });
};

// Function for concert search
var getConcert = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(
    function(response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        console.log("No results found for " + artist);
        return;
      }

      var logData = [];

      logData.push("Upcoming concerts for " + artist + ":");

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

        // Push each line of concert data to `logData`
        // If a concert doesn't have a region, display the country instead
     
        logData.push(
          show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            // Use moment to format the date
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }

      // Print and write the concert data as a string joined by a newline character
      console.log(logData.join("\n"));
      writeToLog(logData.join("\n"));
    }
  );
};

// Function for running a Movie Search
var getMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios.get(urlHit).then(
    function(response) {
      var jsonData = response.data;

      var data = {
        "Title:": jsonData.Title,
        "Year:": jsonData.Year,
        "Rated:": jsonData.Rated,
        "IMDB Rating:": jsonData.imdbRating,
        "Country:": jsonData.Country,
        "Language:": jsonData.Language,
        "Rotten Tomatoes Rating:": jsonData.Ratings[1].Value,
        "Release Date": jsonData.Released,
        "Produce in": jsonData.Country,
        "Actors:": jsonData.Actors,
        "Plot:": jsonData.Plot
      };

      console.log(data);
      writeToLog(data);
    }
  );
};



// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var inforData = data.split(",");

    if (inforData.length === 2) {
      pick(inforData[0], inforData[1]);
    }
    else if (inforData.length === 1) {
      pick(inforData[0]);
    }
  });
};

// Function for determining which command is executed
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "concert-this":
  getConcert(functionData);
    break;
  case "spotify-this-song":
    getMeSpotify(functionData);
    break;
  case "movie-this":
    getMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("input another infor");
  }
};

// Function which takes in command line arguments and executes correct function accordingly
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

// MAIN PROCESS
// =====================================
// console.log(process.argv[2]);
runThis(process.argv[2], process.argv.slice(3).join(" "));






