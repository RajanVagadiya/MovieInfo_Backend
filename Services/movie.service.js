const movieDAO = require('../DAO/movie.dao.js');

async function listMovies({ page, limit }) {
    return movieDAO.list(
        {
            page: Number(page) || 1,
            limit: Number(limit) || 10
        }
    );
}

async function getAllMovies() {
    const allMovies = await movieDAO.getAll();
    if (allMovies.length === 0) {
        const err = new Error('No movies found');
        err.status = 404;
        throw err;
    }
    return allMovies;
}

async function getMovie(id) {
    const movie = await movieDAO.getById(id);
    if (!movie) {
        const err = new Error(`Movie not found with id: ${id}`);
        err.status = 404;
        throw err;
    }
    return movie;
}

async function createMovie(payload) {
    const movie = await movieDAO.createSingle(payload);
    if (!movie) {
        const err = new Error('Movie not created');
        err.status = 400;
        throw err;
    }
    return movie;
}

async function updateMovie(id, payload) {
    const updated = await movieDAO.updateById(id, payload);
    if (!updated) {
        const err = new Error(`Movie can't Updated : ${id}`);
        err.status = 404;
        throw err;
    }
    return updated;
}

async function deleteMovie(id) {
    const deleted = await movieDAO.deleteById(id);
    if (!deleted) {
        const err = new Error(`Movie can't Deleted : ${id}`);
        err.status = 404;
        throw err;
    }
    return deleted;
}

module.exports = { listMovies, getAllMovies, getMovie, createMovie, updateMovie, deleteMovie };