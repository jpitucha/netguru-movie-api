const jwt = require("jsonwebtoken");
const { AUTH_TYPE } = require("./messages");

function getAuthorizationToken(authorizationHeader) {
  if (!/(.+) (.+)/.test(authorizationHeader)) {
    throw new AuthorizationSchemeError();
  }
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== AUTH_TYPE) {
    throw new AuthorizationSchemeError();
  }
  return token;
}

function getUserFromToken(token) {
  try {
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    return userDetails;
  } catch (err) {
    throw new AuthenticationError();
  }
}

module.exports = {
  getUserFromToken,
  getAuthorizationToken,
};
