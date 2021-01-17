async function fetchMovieDetails(title) {
  console.log("using mock");
  return {
    "Title": "Inferno",
    "Year": "2016",
    "Rated": "PG-13",
    "Released": "28 Oct 2016",
    "Runtime": "121 min",
    "Genre": "Action, Adventure, Crime, Drama, Mystery, Thriller",
    "Director": "Ron Howard",
    "Writer": "Dan Brown (based in part on the novel by), David Koepp (screenplay by)",
    "Actors": "Tom Hanks, Felicity Jones, Omar Sy, Irrfan Khan",
    "Plot": "When Robert Langdon wakes up in an Italian hospital with amnesia, he teams up with Dr. Sienna Brooks, and together they must race across Europe against the clock to foil a deadly global plot.",
    "Language": "English, French, Italian, Turkish",
    "Country": "USA, Hungary",
    "Awards": "4 wins & 1 nomination.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTUzNTE2NTkzMV5BMl5BanBnXkFtZTgwMDAzOTUyMDI@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "6.2/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "23%"
      },
      {
        "Source": "Metacritic",
        "Value": "42/100"
      }
    ],
    "Metascore": "42",
    "imdbRating": "6.2",
    "imdbVotes": "157,331",
    "imdbID": "tt3062096",
    "Type": "movie",
    "DVD": "N/A",
    "BoxOffice": "$34,343,574",
    "Production": "Sony Classical, Columbia Pictures, Panorama Films, Imagine Entertainment",
    "Website": "N/A",
    "Response": "True"
  };
}

module.exports = { fetchMovieDetails }