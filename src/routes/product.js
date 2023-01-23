const express = require("express");

const router = express;

const productController = require('../controller/product')

// CREATE -> POST
router.post('/product', productController.createProduct);

// READ -> GET
router.get('/products', productController.getAllProduct)