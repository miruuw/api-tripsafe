const { User } = require('../models/user.model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const userList = await User.find()
    // .select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    // .select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: "pengguna dengan ID yang diberikan tidak ditemukan!" })
    }

    res.status(200).send(user);
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartement: req.body.apartement,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if (!user)
        return res.status(404).send('pengguna tidak dapat dibuat!')

    res.send(user);
})

router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartement: req.body.apartement,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },
        { new: true }
    )

    if (!user)
        return res.status(400).send('pengguna tidak dapat diperbarui!')

    res.send(user);
})

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, phone, street, apartment, zip, city, country } = req.body;

    // Memeriksa apakah pengguna sudah ada
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).send('Email sudah terdaftar!');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Membuat user baru
    user = new User({
        name,
        email,
        passwordHash: hashedPassword,
        phone,
        street,
        apartment,
        zip,
        city,
        country,
    });

    // Menyimpan user ke database
    user = await user.save();

    if (!user) {
        return res.status(500).send('Registrasi gagal! Silakan coba lagi.');
    }

    res.send({
        userId: user.id,
        name: user.name,
        email: user.email,
    });
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Memeriksa apakah pengguna sudah ada
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Email atau password salah!');
    }

    // Memvalidasi password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
        return res.status(400).send('Email atau password salah!');
    }

    res.send('Login berhasil!');
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'user berhasil dihapus!' })
        } else {
            return res.status(404).json({ success: true, message: 'user tidak ada!' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments();

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCount
    })
})

module.exports = router;