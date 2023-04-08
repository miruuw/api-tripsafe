const {User} = require('../models/user.model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false});
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message: "pengguna dengan ID yang diberikan tidak ditemukan!"})
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

    if(!user)
    return res.status(404).send('pengguna tidak dapat dibuat!')

    res.send(user);
})

router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
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

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if(!user){
        return res.status(404).send('Pengguna tidak ada!')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}

        )

        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('kata sandi salah!');
    }

    // return res.status(200).send('user');

})

router.post('/register', async (req, res)=> {
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

    if(!user)
    return res.status(400).send('Pengguna tidak dapat mendaftar!');

    res.send(user);
})

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success: true, message: 'user berhasil dihapus!'})
        } else {
            return res.status(404).json({success: true, message: 'user tidak ada!'})
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})

router.get('/get/count', async (req, res)=>{
    const userCount = await User.countDocuments();

    if(!userCount) {
        res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    })
})

module.exports = router;