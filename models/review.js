const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');
const Schema = moongose.Schema; 

const reviewSchema = new Schema({
    body : String,
    rating: Number
});

module.exports = mongoose.model('Review', reviewSchema);