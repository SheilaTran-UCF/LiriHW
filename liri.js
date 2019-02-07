// Import color chalk package
const chalk = require("chalk");
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
var writeToLog = function (data) {
  // Append the JSON data and add a newline character to the end of the log.txt file
  fs.appendFile("log.txt", JSON.stringify(data) + "\n", function (err) {
    if (err) {
      return console.log(err);
    }
    // log.txt update info
    console.log("log.txt was updated!");
  });
};

//  function to get the artist name
var artistNames = function (artist) {
  return artist.name;
};

// Function for running a Spotify search
var thisSongspotify = function (songName) {
  if (songName === undefined) {
    songName = "beautiful-life";
  }

  spotify.search({
    type: "track",
    query: songName
  },

    function (err, data) {
      if (err) {
        console.log("Error : " + err);
        return;
      }
      // Create var datasongs 
      var songs = data.tracks.items;
      var data = [];
      // loop for data songs.length
      for (var i = 0; i < songs.length; i++) {
        data.push([
          chalk.green("Artists: ") + songs[i].artists.map(artistNames),
          chalk.green("Song name: ") + songs[i].name,
          chalk.green("Album: ") + songs[i].album.name,
          chalk.green("Preview song: ") + songs[i].preview_url
        ]);
      }

      data.forEach(function (songs) {
        console.log("\n-----------------");
        songs.forEach(function (song) {
          console.log(song);
        })
        console.log("-----------------");
      })
      writeToLog(data);

    });

};

// Function for concert search
var getConcert = function (artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(
    function (response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        console.log("No results found for " + artist);
        return;
      }
      var logData = [];

      logData.push("Upcoming concerts for " + artist + ":");

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

        // Push each line of concert data to logData
          logData.push(
          // Use moment to format the date
          chalk.blue(moment(show.datetime).format("MM/DD/YYYY")) +
          show.venue.city +
          "," +
          // If a concert doesn't have a region, display the country + shows name
          (show.venue.region || show.venue.country) +
          " at " +
          show.venue.name

        );
      }// for loop for chalk color
      for (const [key, value] of Object.entries(logData)) {
        console.log(chalk.red(key));
        console.log(value);
      }
      //   write print out concert data
      writeToLog(logData.join("\n"));

    }
  );
};

// Function for running a Movie Search
var getMovie = function (movieName) {
  if (movieName === undefined) {
    movieName = "Love";
  }
  // Create var link for Movie
  var link = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios.get(link).then(
    function (response) {
      var jsonData = response.data;
      // Create Movie data
      let data = [
        chalk.green("Title: ") + jsonData.Title,
        chalk.green("Year: ")+ jsonData.Year,
        chalk.green("Rated: ") + jsonData.Rated,
        chalk.green("IMDB Rating: ") + jsonData.imdbRating,
        chalk.green("Country: ") + jsonData.Country,
        chalk.green("Language: ") + jsonData.Language,
        chalk.green("Rotten Tomatoes Rating: ") + jsonData.Ratings[1].Value,
        chalk.green("Release Date: ") + jsonData.Released,
        chalk.green("Produce in ") + jsonData.Country,
        chalk.green("Actors: ") + jsonData.Actors,
        chalk.green("Plot: ") + jsonData.Plot
      ];
      // print & write the movie data
      data.forEach(function (movie) {
        console.log(movie);
      });
      writeToLog(data);
    }
  );
};

// Function for running a command data on text file
var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
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
var pick = function (caseData, functionData) {
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

// Create Function which data takes in command line arguments and executes correct function accordingly
var argv = function (argv1, argv2) {
  pick(argv1, argv2);
};

// console.log(process.argv[2]);
argv(process.argv[2], process.argv.slice(3).join(" "));






