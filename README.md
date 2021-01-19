# Netguru Movie API

Welcome to my Netguru recruitment task, this is an API that allows you to create your own movie collection.

# Run App

To run the app you have to:

- have docker and docker-compose installed
- specify **.env** file in root project directory
- get key from [OMDB API](http://www.omdbapi.com/)

Example **.env** file

    PORT=5000
    MONGO_INITDB_DATABASE=movie-api
    MONGO_INITDB_ROOT_USERNAME=john
    MONGO_INITDB_ROOT_PASSWORD=PASSWORD
    DB_USERNAME=thomas
    DB_PASSWORD=PASSWORD
    DB_URL=mongodb://thomas:PASSWORD@db:27017/movie-api
    JWT_SECRET=SECRET
    OMDB_KEY=KEY
    BASIC_USER_MOVIE_LIMIT=5

After that just type `docker-compose up`
Application will be available on every device in yours LAN on port provided to **.env** - `default 5000`

# Authorization

Every request has to have `authorization` header set to `Bearer token`. Token has to be obtained from [Netguru auth service](https://github.com/netguru/nodejs-recruitment-task)

# Request payload

In `POST /movies` request body you have to specify movie `title` in `JSON` format. If everything is correct additional move details will be fetched from OMDB and saved into MongoDB

# Documentation

API documentation can be found using browser under `/api-docs`. I used Swagger so you can also test this API at this endpoint

# Tests

You can fire up the tests **locally** written with `Jest` by typing `npm i` and then `npm run test`

# Libraries

While implementing this project I used among the others this libraries:

- Eslint
- Express
- Joi
- Jsonwebtoken
- Mongoose
- Node-fetch
- Prettier
- Swagger
- Winston
- Morgan

# Something is wrong?

Did you find a bug? Feel free to create an issue ;)
