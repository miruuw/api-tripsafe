const mongoose = require('mongoose');

const merchantSchema = mongoose.Schema({
    nama_usaha: {
        type: String,
        required: true
    },
    category_merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatergoryMerchant',
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
    },
    telephone: {
        type: Number,
        default: ''
    },
    whatsapp: {
        type: Number,
        default: ''
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    longitude: {
        type: String,
    },
    latitude: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

exports.Merchant = mongoose.model('Merchant', merchantSchema);