const mongoose = require('mongoose');

const categoryProduct = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

exports.Category = mongoose.model('CategoryProduct', categoryProduct);