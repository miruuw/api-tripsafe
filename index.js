const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const productRoutes = require('./src/routes/product');
const authRoutes = require('./src/routes/auth');

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// =======================================
app.use('/v1/customer', productRoutes);
app.use('/v1/auth', authRoutes);

app.listen(4000);

