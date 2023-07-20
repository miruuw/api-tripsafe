const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fotoprofil: {
        type: String
    },
    nomor_telp: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
   
})


exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;