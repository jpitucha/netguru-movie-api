async function fetchMovieDetails() {
  return {
    title: "Inferno",
    released: "28 Oct 2016",
    genre: "Action, Adventure, Crime, Drama, Mystery, Thriller".split(", "),
    director: "Ron Howard",
  };
}

module.exports = { fetchMovieDetails };
