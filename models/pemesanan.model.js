const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    jam: {
        type: String
    },
    tanggal: {
        type: Date
    },
    nomor_pemesanan: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


exports.Order = mongoose.model('Order', orderSchema);