exports.createProduct = (req, res, next) => {
    res.json(
        {
            message: 'Create Product Success',
            data: {
                id: 1,
                nameProduk: "Laptop AVITA Pura 14",
                harga: "Rp 5.899.000",
                stok: 23
            }
        }
    );
    next();
}

exports.getAllProduct = (req, res, next) => {
    res.json(
        {
            message: 'GET All Product Success',
            data: {
                id: 1,
                nameProduk: "Laptop AVITA Pura 14",
                harga: "Rp 5.899.000",
                stok: 23
            }
        }
    );
    next();
}