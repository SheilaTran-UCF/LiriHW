

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
var artistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var thisSongspotify = function(songName) {
  if (songName === undefined) {
    songName = "beautiful-life";
  }

  spotify.search({ 
    type: "track", 
    query: songName },
    
    function(err, data) {
    if (err) {
      console.log("Error : " + err);
      return;
    }
    // Create var datasongs 
    var songs = data.tracks.items;
    var data = [];
    // loop for data songs.length
    for (var i = 0; i < songs.length; i++) {
      data.push({
        "Artist(s)"     : songs[i].artists.map(artistNames),
        "Song name: "   : songs[i].name,
        "Album: "       : songs[i].album.name,
        "Preview song: ": songs[i].preview_url
      });
    }
    // print & write songs data
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
      // Create var logData 
      var logData = [];
      logData.push("Upcoming concerts for " + artist + ":");
      // loop for shows (concerts) data
      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

        // Push each line of concert data to logData
        // If a concert doesn't have a region, display the country instead
        logData.push(
          show.venue.city + "," + (show.venue.region || show.venue.country) + " at " +
           show.venue.name + " " +
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
  // Create var link
  var link = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios.get(link).then(
    function(response) {
      var jsonData = response.data;
      // Create movie data
      let data = {
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
      // print & write the movie data
      console.log(data);
      writeToLog(data);
    }
  );
};

// Function for running a command data on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    //create var inforData for split ","
    var inforData = data.split(",");

    if (inforData.length === 2) {
      pick(inforData[0], inforData[1]);
    }
    else if (inforData.length === 1) {
      pick(inforData[0]);
    }
  });
};

//Create Function for determining which command is executed
var pick = function(caseData, functionData) {
  switch (caseData) {
    // case data for concert-this
  case "concert-this":
  getConcert(functionData);
    break;
    // case data for spotify-this-song
  case "spotify-this-song":
    thisSongspotify(functionData);
    break;
    // case data for movie-this
  case "movie-this":
    getMovie(functionData);
    break;
    // case data for do-what-it-say
  case "do-what-it-says":
    doWhatItSays();
    break;
    // case default
  default:
    console.log("input another data");
  }
};

// create Function which data takes in command line arguments and executes correct function accordingly
var argv = function(argv1, argv2) {
  pick(argv1, argv2);
};

// console.log(process.argv[2]);
argv(process.argv[2], process.argv.slice(3).join(" "));






