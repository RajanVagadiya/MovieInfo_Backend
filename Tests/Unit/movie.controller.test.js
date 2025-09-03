// Tests/Unit/movie.controller.test.js
const request = require('supertest');
const express = require('express');

// Mock the service BEFORE requiring the router/controller
jest.mock('../../Services/movie.service.js');
const movieService = require('../../Services/movie.service.js');

// Now require the routes (which require controllers which require the service)
const movieRoutes = require('../../Routes/movie.route.js'); // path where your router is

const app = express();
app.use(express.json());
app.use('/', movieRoutes); // mount routes under root for testing

describe('movie.controller (unit)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    
    // Setup default mock implementations
    movieService.listMovies = jest.fn();
    movieService.getAllMovies = jest.fn();
    movieService.getMovie = jest.fn();
    movieService.createMovie = jest.fn();
    movieService.updateMovie = jest.fn();
    movieService.deleteMovie = jest.fn();
  });

  describe('GET /listMovies - List Movies with Pagination', () => {
    test('should return paginated movies with default parameters', async () => {
      const mockResponse = {
        items: [
          { id: '1', title: 'Movie 1', genre: 'Action' },
          { id: '2', title: 'Movie 2', genre: 'Comedy' }
        ],
        total: 50,
        page: 1,
        limit: 10
      };
      movieService.listMovies.mockResolvedValue(mockResponse);

      const res = await request(app).get('/listMovies');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
      expect(movieService.listMovies).toHaveBeenCalledWith({});
    });

    test('should return paginated movies with custom page and limit', async () => {
      const mockResponse = {
        items: [
          { id: '11', title: 'Movie 11', genre: 'Drama' }
        ],
        total: 50,
        page: 2,
        limit: 5
      };
      movieService.listMovies.mockResolvedValue(mockResponse);

      const res = await request(app)
        .get('/listMovies')
        .query({ page: 2, limit: 5 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
      expect(movieService.listMovies).toHaveBeenCalledWith({ page: '2', limit: '5' });
    });

    test('should return empty result when no movies found', async () => {
      const mockResponse = { items: [], total: 0, page: 1, limit: 10 };
      movieService.listMovies.mockResolvedValue(mockResponse);

      const res = await request(app).get('/listMovies');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    test('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      movieService.listMovies.mockRejectedValue(error);

      const res = await request(app).get('/listMovies');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle invalid pagination parameters gracefully', async () => {
      const mockResponse = { items: [], total: 0, page: 1, limit: 10 };
      movieService.listMovies.mockResolvedValue(mockResponse);

      const res = await request(app)
        .get('/listMovies')
        .query({ page: 'invalid', limit: 'invalid' });

      expect(res.status).toBe(200);
      expect(movieService.listMovies).toHaveBeenCalledWith({ page: 'invalid', limit: 'invalid' });
    });
  });

  describe('GET /getAllMovies - Get All Movies', () => {
    test('should return all movies successfully', async () => {
      const mockMovies = [
        { id: '1', title: 'Movie 1', genre: 'Action' },
        { id: '2', title: 'Movie 2', genre: 'Comedy' },
        { id: '3', title: 'Movie 3', genre: 'Drama' }
      ];
      movieService.getAllMovies.mockResolvedValue(mockMovies);

      const res = await request(app).get('/getAllMovies');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMovies);
      expect(movieService.getAllMovies).toHaveBeenCalledWith();
    });

    test('should return 404 when no movies exist', async () => {
      const error = new Error('No movies found');
      error.status = 404;
      movieService.getAllMovies.mockRejectedValue(error);

      const res = await request(app).get('/getAllMovies');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      movieService.getAllMovies.mockRejectedValue(error);

      const res = await request(app).get('/getAllMovies');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /getMovie/:id - Get Single Movie', () => {
    test('should return movie when found', async () => {
      const mockMovie = { 
        id: '507f1f77bcf86cd799439011', 
        title: 'Test Movie', 
        genre: 'Action',
        director: 'John Doe',
        releaseYear: 2023
      };
      movieService.getMovie.mockResolvedValue(mockMovie);

      const res = await request(app).get('/getMovie/507f1f77bcf86cd799439011');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMovie);
      expect(movieService.getMovie).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    test('should return 404 when movie not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error(`Movie not found with id: ${movieId}`);
      error.status = 404;
      movieService.getMovie.mockRejectedValue(error);

      const res = await request(app).get(`/getMovie/${movieId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle invalid ObjectId format', async () => {
      const invalidId = 'invalid-id';
      const error = new Error('Invalid ObjectId format');
      movieService.getMovie.mockRejectedValue(error);

      const res = await request(app).get(`/getMovie/${invalidId}`);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      movieService.getMovie.mockRejectedValue(error);

      const res = await request(app).get('/getMovie/507f1f77bcf86cd799439011');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });
  });

  // ===== Updated Create, Update, Delete Tests to expect message only =====

  describe('POST /addMovie - Create Movie', () => {
    test('should create movie successfully', async () => {
      const moviePayload = {
        title: 'New Movie',
        genre: 'Thriller',
        director: 'Jane Smith',
        releaseYear: 2024
      };
      movieService.createMovie.mockResolvedValue(moviePayload);

      const res = await request(app)
        .post('/addMovie')
        .send(moviePayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Movie created successfully' });
      expect(movieService.createMovie).toHaveBeenCalledWith(moviePayload);
    });

    test('should return 400 for validation errors', async () => {
      const error = new Error('Movie not created');
      error.status = 400;
      movieService.createMovie.mockRejectedValue(error);

      const res = await request(app)
        .post('/addMovie')
        .send({}); 

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle missing required fields', async () => {
      const error = new Error('Title is required');
      error.status = 400;
      movieService.createMovie.mockRejectedValue(error);

      const res = await request(app)
        .post('/addMovie')
        .send({ genre: 'Action' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle duplicate movie creation', async () => {
      const error = new Error('Movie with this title already exists');
      error.status = 409;
      movieService.createMovie.mockRejectedValue(error);

      const res = await request(app)
        .post('/addMovie')
        .send({ title: 'Existing Movie', genre: 'Action' });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      movieService.createMovie.mockRejectedValue(error);

      const res = await request(app)
        .post('/addMovie')
        .send({ title: 'Test Movie' });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle invalid JSON payload', async () => {
      const res = await request(app)
        .post('/addMovie')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /updateMovie/:id - Update Movie', () => {
    test('should update movie successfully', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const updatePayload = { title: 'Updated Movie', genre: 'Drama' };
      movieService.updateMovie.mockResolvedValue(updatePayload);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Movie updated successfully' });
      expect(movieService.updateMovie).toHaveBeenCalledWith(movieId, updatePayload);
    });

    test('should return 404 when movie to update not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error(`Movie can't Updated : ${movieId}`);
      error.status = 404;
      movieService.updateMovie.mockRejectedValue(error);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle partial updates', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const updatePayload = { genre: 'Horror' };
      movieService.updateMovie.mockResolvedValue(updatePayload);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Movie updated successfully' });
    });

    test('should handle empty update payload', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error(`Movie can't Updated : ${movieId}`);
      error.status = 404;
      movieService.updateMovie.mockRejectedValue(error);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send({});

      expect(res.status).toBe(404);
    });

    test('should handle validation errors', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Title cannot be empty');
      error.status = 400;
      movieService.updateMovie.mockRejectedValue(error);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send({ title: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle service errors', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Database connection failed');
      movieService.updateMovie.mockRejectedValue(error);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /deleteMovie/:id - Delete Movie', () => {
    test('should delete movie successfully', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      movieService.deleteMovie.mockResolvedValue({});

      const res = await request(app).delete(`/deleteMovie/${movieId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Movie deleted successfully' });
      expect(movieService.deleteMovie).toHaveBeenCalledWith(movieId);
    });

    test('should return 404 when movie to delete not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error(`Movie can't Deleted : ${movieId}`);
      error.status = 404;
      movieService.deleteMovie.mockRejectedValue(error);

      const res = await request(app).delete(`/deleteMovie/${movieId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle constraint violations', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Cannot delete movie with active references');
      error.status = 409;
      movieService.deleteMovie.mockRejectedValue(error);

      const res = await request(app).delete(`/deleteMovie/${movieId}`);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle invalid ObjectId format', async () => {
      const invalidId = 'invalid-id';
      const error = new Error('Invalid ObjectId format');
      movieService.deleteMovie.mockRejectedValue(error);

      const res = await request(app).delete(`/deleteMovie/${invalidId}`);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle service errors', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Database connection failed');
      movieService.deleteMovie.mockRejectedValue(error);

      const res = await request(app).delete(`/deleteMovie/${movieId}`);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });
  });

  // ===== Edge Cases =====
  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed JSON in request body', async () => {
      const res = await request(app)
        .post('/addMovie')
        .set('Content-Type', 'application/json')
        .send('{"title": "Test Movie", "genre":}');

      expect(res.status).toBe(400);
    });

    test('should handle very large request payloads', async () => {
      const largePayload = {
        title: 'A'.repeat(10000),
        genre: 'Action'
      };
      const error = new Error('Payload too large');
      error.status = 413;
      movieService.createMovie.mockRejectedValue(error);

      const res = await request(app)
        .post('/addMovie')
        .send(largePayload);

      expect(res.status).toBe(413);
    });

    test('should handle missing route parameters', async () => {
      const res = await request(app).get('/getMovie/');
      expect([404, 400]).toContain(res.status);
    });

    test('should handle concurrent requests gracefully', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Document was modified by another process');
      error.status = 409;
      movieService.updateMovie.mockRejectedValue(error);

      const res = await request(app)
        .put(`/updateMovie/${movieId}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    });

    test('should handle special characters in movie ID', async () => {
      const specialId = '507f1f77bcf86cd799439011%20test';
      const error = new Error('Invalid ObjectId format');
      movieService.getMovie.mockRejectedValue(error);

      const res = await request(app).get(`/getMovie/${specialId}`);

      expect(res.status).toBe(500);
    });

    test('should handle timeout scenarios', async () => {
      const error = new Error('Request timeout');
      error.status = 408;
      movieService.getAllMovies.mockRejectedValue(error);

      const res = await request(app).get('/getAllMovies');

      expect(res.status).toBe(408);
      expect(res.body).toHaveProperty('message');
    });
  });
});
