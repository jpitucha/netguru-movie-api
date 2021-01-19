const jwt = require("jsonwebtoken");
const { AUTH_TYPE } = require("./messages");

function hasDotEnvVars() {
  if (!process.env.MONGO_INITDB_DATABASE) return false;
  if (!process.env.MONGO_INITDB_ROOT_USERNAME) return false;
  if (!process.env.MONGO_INITDB_ROOT_PASSWORD) return false;
  if (!process.env.DB_USERNAME) return false;
  if (!process.env.DB_PASSWORD) return false;
  if (!process.env.DB_URL) return false;
  if (!process.env.PORT) return false;
  if (!process.env.JWT_SECRET) return false;
  if (!process.env.OMDB_KEY) return false;
  if (!process.env.BASIC_USER_MOVIE_LIMIT) return false;
  return true;
}

class AuthorizationSchemeError extends Error {}
class AuthenticationError extends Error {}

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
  hasDotEnvVars,
  getUserFromToken,
  getAuthorizationToken,
  AuthorizationSchemeError,
  AuthenticationError,
};
