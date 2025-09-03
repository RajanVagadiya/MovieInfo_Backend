const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    releaseYear: {
        type: Number,
        required : true,
        min: 1888
    }, 
    genre: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
});

module.exports = mongoose.model('Movie', movieSchema);