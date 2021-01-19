const { getAuthorizationToken, AuthorizationSchemeError } = require("../auth");

test("extracts token from authorization header", () => {
  const EXPECTED = "xdcfgvhbjdrtfghbj";

  const actual = getAuthorizationToken("Bearer xdcfgvhbjdrtfghbj");

  expect(actual).toBe(EXPECTED);
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
