const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

// deklarasi middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({message: err})
    }
})

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'tripsafe_db'
})
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err)=> {
        console.log(err);
    })
// deklarasi port di 8080
const port = 7000;
app.listen(port, ()=> {
    console.log(`server is running http://localhost:${port}`);
})

// routes 
// const categoriesRoutes = require('./routes/categories.router');
// const productRoutes = require('./routes/products.router')
const userRoutes = require('./routes/users.router');
// const orderRoutes = require('./routes/orders.router');
// deklarasi dari file .env
// deklarasi router express
// app.use(`${api}/categories`, categoriesRoutes);
// app.use(`${api}/products`, productRoutes);
app.use(userRoutes);
// app.use(`${api}/orders`, orderRoutes);
// deklarasi mongoose untuk koneksi ke db compass
mongoose.set("strictQuery", false);