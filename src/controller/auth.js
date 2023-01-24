exports.register = (req, res, next) => {
    let nama = req.body.nama;
    let email = req.body.email;
    let password = req.body.password;
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

