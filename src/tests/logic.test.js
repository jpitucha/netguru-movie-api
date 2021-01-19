jest.mock("./../omdbapi");

const Movie = require("../db/schema/movieSchema");

const { getAuthorizationToken, AuthorizationSchemeError } = require("../logic");

const {
  DuplicateMovieError,
  LimitExceededError,
  handleMovieCreationRequest,
} = require("../routes/movies/mongoUtils");

const { MovieNotFoundInOmdbError } = require("./../omdbapi");
const mockingoose = require("mockingoose").default;

beforeEach(() => {
  mockingoose.resetAll();
});

const userDetailsForTesting = {
  userId: 1,
  role: "basic",
};

test("extracts token from authorization header", () => {
  expect(getAuthorizationToken("Bearer xdcfgvhbjdrtfghbj")).toBe(
    "xdcfgvhbjdrtfghbj"
  );
});

test("throws if authorization scheme is not Bearer", () => {
  expect(() => getAuthorizationToken("Basic xdcfgvhbjdrtfghbj")).toThrowError(
    AuthorizationSchemeError
  );
});

test("throws if authorization header value is not valid", () => {
  expect(() => getAuthorizationToken("setyihuytfojij")).toThrowError(
    AuthorizationSchemeError
  );
});

const expectedMovieSchema = expect.objectContaining({
  _id: expect.any(Object),
  createdBy: expect.any(String),
  createdAt: expect.any(String),
  title: expect.any(String),
  released: expect.any(String),
  genre: expect.any(Array),
  director: expect.any(String),
});

test("creates movie upon valid request", async () => {
  mockingoose(Movie).toReturn((query) => {
    if (query.getQuery().title === "Inferno") {
      return 0;
    }
    return 3;
  }, "countDocuments");
  const createdMovie = await handleMovieCreationRequest(
    "Inferno",
    userDetailsForTesting
  );
  expect(createdMovie.title).toBe("Inferno");
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
