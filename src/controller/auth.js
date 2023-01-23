exports.register = (req, res, next) => {
    const nama = req.body.nama;
    const email = req.body.email;
    const password = req.body.password;
    const result = {
        message : 'Register Success',
        data : {
            uid: 1,
            nama: nama,
            email: email
        }
    }
    res.status(201).json(result);
    next();
}

