// Tests/Unit/movie.service.test.js
// Adjust these relative paths to match your project structure
const movieService = require('../../Services/movie.service.js'); 
jest.mock('../../DAO/movie.dao.js'); // mock DAO
const movieDAO = require('../../DAO/movie.dao.js');

describe('movie.service (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations to match your actual DAO methods
    movieDAO.list = jest.fn();
    movieDAO.getAll = jest.fn();
    movieDAO.getById = jest.fn();
    movieDAO.createSingle = jest.fn();  // Your actual method name
    movieDAO.updateById = jest.fn();    // Your actual method name
    movieDAO.deleteById = jest.fn();    // Your actual method name
  });

  describe('listMovies', () => {
    test('should return pagination payload with movies', async () => {
      const mockPayload = { 
        items: [
          { id: '1', title: 'Movie 1', genre: 'Action' },
          { id: '2', title: 'Movie 2', genre: 'Comedy' }
        ], 
        total: 25, 
        page: 1, 
        limit: 10 
      };
      movieDAO.list.mockResolvedValue(mockPayload);

      const result = await movieService.listMovies({ page: 1, limit: 10 });

      expect(result).toEqual(mockPayload);
      expect(movieDAO.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    test('should return empty payload when no movies found', async () => {
      const mockPayload = { items: [], total: 0, page: 1, limit: 10 };
      movieDAO.list.mockResolvedValue(mockPayload);

      const result = await movieService.listMovies({ page: 1, limit: 10 });

      expect(result).toEqual(mockPayload);
      expect(movieDAO.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    test('should handle default pagination values', async () => {
      const mockPayload = { items: [], total: 0, page: 1, limit: 10 };
      movieDAO.list.mockResolvedValue(mockPayload);

      const result = await movieService.listMovies({});

      expect(result).toEqual(mockPayload);
      expect(movieDAO.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    test('should handle DAO errors', async () => {
      const error = new Error('Database connection failed');
      movieDAO.list.mockRejectedValue(error);

      await expect(movieService.listMovies({ page: 1, limit: 10 }))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('getAllMovies', () => {
    test('should return all movies when movies exist', async () => {
      const mockMovies = [
        { id: '1', title: 'Movie 1', genre: 'Action' },
        { id: '2', title: 'Movie 2', genre: 'Comedy' },
        { id: '3', title: 'Movie 3', genre: 'Drama' }
      ];
      movieDAO.getAll.mockResolvedValue(mockMovies);

      const result = await movieService.getAllMovies();

      expect(result).toEqual(mockMovies);
      expect(movieDAO.getAll).toHaveBeenCalledWith();
    });

    test('should throw 404 error when no movies exist', async () => {
      movieDAO.getAll.mockResolvedValue([]);

      await expect(movieService.getAllMovies())
        .rejects.toMatchObject({
          status: 404,
          message: 'No movies found'
        });

      expect(movieDAO.getAll).toHaveBeenCalledWith();
    });

    test('should handle DAO errors', async () => {
      const error = new Error('Database error');
      movieDAO.getAll.mockRejectedValue(error);

      await expect(movieService.getAllMovies()).rejects.toThrow('Database error');
    });
  });

  describe('getMovie', () => {
    test('should return movie when found', async () => {
      const mockMovie = { id: '507f1f77bcf86cd799439011', title: 'Test Movie', genre: 'Action' };
      movieDAO.getById.mockResolvedValue(mockMovie);

      const result = await movieService.getMovie('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockMovie);
      expect(movieDAO.getById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    test('should throw 404 error when movie not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      movieDAO.getById.mockResolvedValue(null);

      await expect(movieService.getMovie(movieId))
        .rejects.toMatchObject({
          status: 404,
          message: `Movie not found with id: ${movieId}`
        });

      expect(movieDAO.getById).toHaveBeenCalledWith(movieId);
    });

    test('should handle DAO errors', async () => {
      const error = new Error('Database connection failed');
      movieDAO.getById.mockRejectedValue(error);

      await expect(movieService.getMovie('507f1f77bcf86cd799439011'))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('createMovie', () => {
    test('should create movie successfully', async () => {
      const payload = { 
        title: 'New Movie', 
        genre: 'Thriller', 
        director: 'John Doe',
        releaseYear: 2023 
      };
      const createdMovie = { id: '507f1f77bcf86cd799439011', ...payload };
      movieDAO.createSingle.mockResolvedValue(createdMovie);

      const result = await movieService.createMovie(payload);

      expect(result).toEqual(createdMovie);
      expect(result).toHaveProperty('id', '507f1f77bcf86cd799439011');
      expect(movieDAO.createSingle).toHaveBeenCalledWith(payload);
    });

    test('should throw 400 error when movie creation fails', async () => {
      const payload = { title: 'Test Movie' };
      movieDAO.createSingle.mockResolvedValue(null);

      await expect(movieService.createMovie(payload))
        .rejects.toMatchObject({
          status: 400,
          message: 'Movie not created'
        });

      expect(movieDAO.createSingle).toHaveBeenCalledWith(payload);
    });

    test('should handle DAO errors during creation', async () => {
      const payload = { title: 'Test Movie' };
      const error = new Error('Database constraint violation');
      movieDAO.createSingle.mockRejectedValue(error);

      await expect(movieService.createMovie(payload))
        .rejects.toThrow('Database constraint violation');
    });
  });

  describe('updateMovie', () => {
    test('should update movie successfully', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const updatePayload = { 
        title: 'Updated Movie Title', 
        genre: 'Drama' 
      };
      const updatedMovie = { 
        id: movieId, 
        title: 'Updated Movie Title', 
        genre: 'Drama',
        director: 'Jane Smith',
        releaseYear: 2022 
      };
      
      movieDAO.updateById.mockResolvedValue(updatedMovie);

      const result = await movieService.updateMovie(movieId, updatePayload);

      expect(result).toEqual(updatedMovie);
      expect(movieDAO.updateById).toHaveBeenCalledWith(movieId, updatePayload);
    });

    test('should throw 404 error when movie to update not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const updatePayload = { title: 'Updated Title' };
      
      movieDAO.updateById.mockResolvedValue(null);

      await expect(movieService.updateMovie(movieId, updatePayload))
        .rejects.toMatchObject({
          status: 404,
          message: `Movie can't Updated : ${movieId}`
        });

      expect(movieDAO.updateById).toHaveBeenCalledWith(movieId, updatePayload);
    });

    test('should handle DAO errors during update', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const updatePayload = { title: 'Updated Title' };
      const error = new Error('Database connection failed');
      
      movieDAO.updateById.mockRejectedValue(error);

      await expect(movieService.updateMovie(movieId, updatePayload))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('deleteMovie', () => {
    test('should delete movie successfully', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const deletedMovie = { 
        id: movieId, 
        title: 'Deleted Movie', 
        genre: 'Action' 
      };
      
      movieDAO.deleteById.mockResolvedValue(deletedMovie);

      const result = await movieService.deleteMovie(movieId);

      expect(result).toEqual(deletedMovie);
      expect(movieDAO.deleteById).toHaveBeenCalledWith(movieId);
    });

    test('should throw 404 error when movie to delete not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      
      movieDAO.deleteById.mockResolvedValue(null);

      await expect(movieService.deleteMovie(movieId))
        .rejects.toMatchObject({
          status: 404,
          message: `Movie can't Deleted : ${movieId}`
        });

      expect(movieDAO.deleteById).toHaveBeenCalledWith(movieId);
    });

    test('should handle DAO errors during deletion', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Cannot delete referenced movie');
      
      movieDAO.deleteById.mockRejectedValue(error);

      await expect(movieService.deleteMovie(movieId))
        .rejects.toThrow('Cannot delete referenced movie');
    });

    test('should handle database constraint errors', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Foreign key constraint violation');
      
      movieDAO.deleteById.mockRejectedValue(error);

      await expect(movieService.deleteMovie(movieId))
        .rejects.toThrow('Foreign key constraint violation');
    });
  });

  describe('Edge Cases', () => {
    test('should handle invalid movie ID format', async () => {
      const invalidId = 'invalid-id';
      const error = new Error('Invalid ObjectId format');
      
      movieDAO.getById.mockRejectedValue(error);

      await expect(movieService.getMovie(invalidId))
        .rejects.toThrow('Invalid ObjectId format');
    });

    test('should handle string page and limit values', async () => {
      const mockPayload = { items: [], total: 0, page: 2, limit: 5 };
      movieDAO.list.mockResolvedValue(mockPayload);

      const result = await movieService.listMovies({ page: '2', limit: '5' });

      expect(result).toEqual(mockPayload);
      expect(movieDAO.list).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });

    test('should handle undefined page and limit values', async () => {
      const mockPayload = { items: [], total: 0, page: 1, limit: 10 };
      movieDAO.list.mockResolvedValue(mockPayload);

      const result = await movieService.listMovies({ page: undefined, limit: undefined });

      expect(result).toEqual(mockPayload);
      expect(movieDAO.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    test('should handle concurrent access scenarios', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const error = new Error('Document was modified by another process');
      
      movieDAO.updateById.mockRejectedValue(error);

      await expect(movieService.updateMovie(movieId, { title: 'New Title' }))
        .rejects.toThrow('Document was modified by another process');
    });
  });
});