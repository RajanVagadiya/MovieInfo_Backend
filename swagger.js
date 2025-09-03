// src/docs/swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movie API',
    description: 'CRUD API for movies with pagination',
    version: '1.0.0'
  },
  host: 'localhost:4000',
  basePath: '/api/v1/movies',   // 👈 keep as requested
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Movies',
      description: 'Movie management endpoints'
    }
  ],
  definitions: {
    Movie: {
      id: '507f1f77bcf86cd799439011',
      title: 'The Godfather',
      director: 'Francis Ford Coppola',
      releaseYear: 1972,
      genre: 'Crime',
      rating: 9.2
    },
    MovieInput: {
      title: 'The Godfather',
      director: 'Francis Ford Coppola',
      releaseYear: 1972,
      genre: 'Crime',
      rating: 9.2
    },
    PaginatedMovies: {
      items: [
        { $ref: '#/definitions/Movie' }
      ],
      total: 100,
      page: 1,
      limit: 10
    }
  }
};

// Path where swagger JSON will be generated
const outputFile = './swagger-output.json';

// Route file(s) with #swagger annotations
const endpointsFiles = ['./Routes/movie.route.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated successfully');
  console.log('Start your server and use swagger-ui-express to serve it.');
});
