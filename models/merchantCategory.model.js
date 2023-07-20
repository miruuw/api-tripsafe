const mongoose = require('mongoose');

const categoryMerchant = mongoose.Schema({
    nama_category: {
        type: String,
        require: true
    }
})

exports.CategoryMerchant = mongoose.model('CatergoryMerchant', categoryMerchant);