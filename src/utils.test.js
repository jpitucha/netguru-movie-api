const Movie = require("./db/schema/movieSchema");
const {
  checkIfMovieExists,
  getAuthorizationToken,
  AuthorizationSchemeError,
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
