jest.mock("./../omdbapi");

const mockingoose = require("mockingoose").default;

const Movie = require("../db/schema/movieSchema");

beforeEach(() => {
  mockingoose.resetAll();
});

const {
  DuplicateMovieError,
  LimitExceededError,
  handleMovieCreationRequest,
} = require("../routes/movies/mongoUtils");

const expectedMovieSchema = expect.objectContaining({
  _id: expect.any(Object),
  createdBy: expect.any(String),
  createdAt: expect.any(String),
  title: expect.any(String),
  released: expect.any(String),
  genre: expect.any(String),
  director: expect.any(String),
});

const userDetailsForTesting = {
  userId: 1,
  role: "basic",
};

const { MovieNotFoundInOmdbError } = require("../omdbapi");

test("creates movie upon valid request", async () => {
  const EXPECTED_TITLE = "Inferno";

  mockingoose(Movie).toReturn((query) => {
    if (query.getQuery().title === EXPECTED_TITLE) {
      return 0;
    }
    return 3;
  }, "countDocuments");
  const createdMovie = await handleMovieCreationRequest(
    "Inferno",
    userDetailsForTesting
  );
  expect(createdMovie.title).toBe(EXPECTED_TITLE);
  expect(createdMovie).toEqual(expectedMovieSchema);
});

test("creates movie upon valid request", async () => {
  mockingoose(Movie).toReturn((query) => {
    if (query.getQuery().title === "moviethatdoesntexist") {
      return 0;
    }
    return 3;
  }, "countDocuments");

  expect(async () => {
    await handleMovieCreationRequest(
      "moviethatdoesntexist",
      userDetailsForTesting
    );
  }).rejects.toThrowError(MovieNotFoundInOmdbError);
});

test("throws when attempting to create a duplicate movie", async () => {
  mockingoose(Movie).toReturn((query) => {
    if (query.getQuery().title === "Inferno") {
      return 1;
    }
    return 3;
  }, "countDocuments");
  expect(async () => {
    await handleMovieCreationRequest("Inferno", userDetailsForTesting);
  }).rejects.toThrowError(DuplicateMovieError);
});

test("throws when user has exceeded quota", async () => {
  mockingoose(Movie).toReturn((query) => {
    if (query.getQuery().title === "Inferno") {
      return 0;
    }
    return 5;
  }, "countDocuments");
  expect(async () => {
    await handleMovieCreationRequest("Inferno", userDetailsForTesting);
  }).rejects.toThrowError(LimitExceededError);
});
