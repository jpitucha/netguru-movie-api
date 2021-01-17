jest.mock("./utils");

const Movie = require("./db/schema/movieSchema");

const {
  checkIfMovieExists,
  getAuthorizationToken,
  AuthorizationSchemeError,
  isUserWithinUsageLimit,
  fetchMovieDetails,
  test
} = require("./utils");

const mockingoose = require("mockingoose").default;

test("extracts token from authorization header", () => {
  expect(getAuthorizationToken("Bearer xdcfgvhbjdrtfghbj")).toBe(
    "xdcfgvhbjdrtfghbj"
  );
});

test("fails if authorization scheme is not Bearer", () => {
  expect(() => getAuthorizationToken("Basic xdcfgvhbjdrtfghbj")).toThrowError(
    AuthorizationSchemeError
  );
});

test("fails if authorization scheme is not valid", () => {
  expect(() => getAuthorizationToken("setyihuytfojij")).toThrowError(
    AuthorizationSchemeError
  );
});

test("checks if movie exists", async () => {
  mockingoose(Movie).toReturn({}, "find").toReturn(1, "countDocuments");
  const movieExists = await checkIfMovieExists("bla bla");
  expect(movieExists).toBe(true);
});


test("checks if user is within usage limit", async () => {
  mockingoose(Movie).toReturn(4, "countDocuments");
  expect(await isUserWithinUsageLimit()).toBe(true);
  mockingoose(Movie).toReturn(5, "countDocuments");
  expect(await isUserWithinUsageLimit()).toBe(false);
});


test("fetches movie details", async () => {
  const fetchedMovieDetails = await test("dfghj");
  expect(fetchedMovieDetails.Title).toBe("Inferno");
});