const express = require('express');
const router = express.Router();

const {
  listMovieByPage,
  getAllMoviesRecord,
  getMovieById,
  createMovieReocord,
  updateMovieById,
  removeMovieById
} = require('../Controllers/movie.controller.js');

// GET /listMovies?page=&limit=
router.get(
  '/listMovies',
  /* #swagger.tags = ['Movies']
     #swagger.description = 'Get paginated list of movies'
     #swagger.parameters['page'] = {
        in: 'query',
        description: 'Page number (default: 1)',
        required: false,
        type: 'integer',
        example: 1
     }
     #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Number of records per page (default: 10)',
        required: false,
        type: 'integer',
        example: 10
     }
     #swagger.responses[200] = { schema: { $ref: '#/definitions/PaginatedMovies' } }
  */
  listMovieByPage
);

// GET /getAllmovies
router.get(
  '/getAllmovies',
  /* #swagger.tags = ['Movies']
     #swagger.description = 'Get all movies (no pagination)'
     #swagger.responses[200] = { schema: { type: 'array', items: { $ref: '#/definitions/Movie' } } }
  */
  getAllMoviesRecord
);

// GET /getMovie/:id
router.get(
  '/getMovie/:id',
  /* #swagger.tags = ['Movies']
     #swagger.description = 'Get a single movie by ID'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Movie ID',
        required: true,
        type: 'string',
        example: '507f1f77bcf86cd799439011'
     }
     #swagger.responses[200] = { schema: { $ref: '#/definitions/Movie' } }
     #swagger.responses[404] = { description: 'Movie not found' }
  */
  getMovieById
);

// POST /addMovie
router.post(
  '/addMovie',
  /* #swagger.tags = ['Movies']
     #swagger.description = 'Create a new movie'
     #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Movie details',
        schema: { $ref: '#/definitions/MovieInput' }
     }
     #swagger.responses[201] = { schema: { $ref: '#/definitions/Movie' } }
  */
  createMovieReocord
);

// PUT /updateMovie/:id
router.put(
  '/updateMovie/:id',
  /* #swagger.tags = ['Movies']
     #swagger.description = 'Update an existing movie by ID'
     #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'Movie ID'
     }
     #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Updated movie object',
        schema: { $ref: '#/definitions/MovieInput' }
     }
     #swagger.responses[200] = { schema: { $ref: '#/definitions/Movie' } }
     #swagger.responses[404] = { description: 'Movie not found' }
  */
  updateMovieById
);

// DELETE /deleteMovie/:id
router.delete(
  '/deleteMovie/:id',
  /* #swagger.tags = ['Movies']
     #swagger.description = 'Delete a movie by ID'
     #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'Movie ID'
     }
     #swagger.responses[204] = { description: 'No content' }
     #swagger.responses[404] = { description: 'Movie not found' }
  */
  removeMovieById
);

module.exports = router;
