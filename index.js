require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoString = process.env.DATABASE_URL
const routes = require('./routes/routes');


const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/api', routes);

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.error(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})



app.listen(3000, () => {
    console.log('Sever started at port 3000');
})


