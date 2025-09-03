const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const movieRoutes = require('../../Routes/movie.route'); // Your router
const Movie = require('../../modals/movie.modal'); // Your Mongoose model (fix path)

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use('/', movieRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Movie.deleteMany({});
});

describe('Movie API Integration Tests', () => {

  // ---------------- List Movies ----------------
  describe('GET /listMovies', () => {
    test('should return paginated movies', async () => {
      await Movie.insertMany([
        { title: 'Movie 1', genre: 'Action', director: 'John', releaseYear: 2022, rating: 8 },
        { title: 'Movie 2', genre: 'Comedy', director: 'Jane', releaseYear: 2021, rating: 7 },
      ]);

      const res = await request(app).get('/listMovies');

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items[0].title).toBe('Movie 1');
    });

    test('should return empty array if no movies', async () => {
      const res = await request(app).get('/listMovies');

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(0);
    });
  });

  // ---------------- Get All Movies ----------------
  describe('GET /getAllMovies', () => {
    test('should return all movies', async () => {
      await Movie.insertMany([
        { title: 'Movie A', genre: 'Action', director: 'John', releaseYear: 2020, rating: 9 },
      ]);

      const res = await request(app).get('/getAllMovies');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Movie A');
    });
  });

  // ---------------- Get Movie by ID ----------------
  describe('GET /getMovie/:id', () => {
    test('should return movie by ID', async () => {
      const movie = await Movie.create({ title: 'Test Movie', genre: 'Horror', director: 'X', releaseYear: 2023, rating: 6 });

      const res = await request(app).get(`/getMovie/${movie._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Movie');
    });
  });

  // ---------------- Create Movie ----------------
  describe('POST /addMovie', () => {
    test('should create movie successfully', async () => {
      const payload = { title: 'New Movie', genre: 'Action', director: 'A', releaseYear: 2024, rating: 8 };

      const res = await request(app).post('/addMovie').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Movie created successfully');

      const movie = await Movie.findOne({ title: 'New Movie' });
      expect(movie).not.toBeNull();
    });

    test('should return 400 for missing title', async () => {
      const payload = { genre: 'Action', director: 'B', releaseYear: 2023, rating: 7 };
      const res = await request(app).post('/addMovie').send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  // ---------------- Update Movie ----------------
  describe('PUT /updateMovie/:id', () => {
    test('should update movie successfully', async () => {
      const movie = await Movie.create({ title: 'Old Title', genre: 'Comedy', director: 'B', releaseYear: 2022, rating: 7 });

      const res = await request(app)
        .put(`/updateMovie/${movie._id}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Movie updated successfully');

      const updatedMovie = await Movie.findById(movie._id);
      expect(updatedMovie.title).toBe('Updated Title');
    });
  });

  // ---------------- Delete Movie ----------------
  describe('DELETE /deleteMovie/:id', () => {
    test('should delete movie successfully', async () => {
      const movie = await Movie.create({ title: 'To Delete', genre: 'Drama', director: 'C', releaseYear: 2021, rating: 8 });

      const res = await request(app).delete(`/deleteMovie/${movie._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Movie deleted successfully');

      const check = await Movie.findById(movie._id);
      expect(check).toBeNull();
    });
  });

});
