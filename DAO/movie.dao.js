const Movies = require('../modals/movie.modal.js');

// For pagination
async function list({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Movies.find().skip(skip).limit(limit).lean(),
        Movies.countDocuments()
    ]);
    return { items, total, page, limit };
}

// these all are simple CRUD 
function getAll() {
    return Movies.find().lean();
}

function getById(id) { 
    return Movies.findById(id).lean(); 
}

function createSingle(data) { 
    return Movies.create(data); 
}

function updateById(id, data) { 
    return Movies.findByIdAndUpdate(id, data).lean(); 
}

function deleteById(id) { 
    return Movies.findByIdAndDelete(id).lean(); 
}

module.exports = { list, getAll, getById, createSingle, updateById, deleteById };