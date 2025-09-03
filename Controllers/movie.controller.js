const movieService = require('../Services/movie.service.js');

// List movies with pagination
async function listMovieByPage(req, res) {
  try {
    const movies = await movieService.listMovies(req.query);
    res.status(200).json(movies);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Get all movies
async function getAllMoviesRecord(req, res) {
  try {
    const movies = await movieService.getAllMovies();
    if (!movies || movies.length === 0) {
      return res.status(404).json({ message: 'No movies found' });
    }
    res.status(200).json(movies);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Get movie by ID
async function getMovieById(req, res) {
  try {
    const movie = await movieService.getMovie(req.params.id);
    if (!movie) return res.status(404).json({ message: `Movie not found with id: ${req.params.id}` });
    const movieData = typeof movie.toObject === 'function' ? movie.toObject() : movie;
    res.status(200).json(movieData);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Create new movie
async function createMovieReocord(req, res) {
  try {
    const movie = await movieService.createMovie(req.body);
    res.status(201).json({ message: 'Movie created successfully'});
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Update movie by ID
async function updateMovieById(req, res) {
  try {
    const updatedMovie = await movieService.updateMovie(
      req.params.id, req.body
    );
    if (!updatedMovie) return res.status(404).json({ message: `Movie can't Updated: ${req.params.id}` });
    res.status(200).json({ message: 'Movie updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Delete movie by ID
async function removeMovieById(req, res) {
  try {
    await movieService.deleteMovie(req.params.id);
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

module.exports = {
  listMovieByPage,
  getAllMoviesRecord,
  getMovieById,
  createMovieReocord,
  updateMovieById,
  removeMovieById,
};
