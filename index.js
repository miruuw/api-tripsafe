import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const productRoutes = require('./src/routes/KategoriRoute');
const authRoutes = require('./src/routes/Auth');

// connect to database
mongoose.connect('mongodb://localhost:27017/fullstack_db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));
// app.use((req, res, next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// })

// =======================================
// parse application/json
app.use(express.json());
app.use(cors());
app.use('/v1/customer', productRoutes);
app.use('/v1/auth', authRoutes);

app.listen(4000, ()=> console.log('Server up and running'));

