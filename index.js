require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoString = process.env.DATABASE_URL
const routes = require('./routes/routes');
const multer = require('multer');
const morgan = require('morgan')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const app = express();
app.use(morgan('dev'));
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


const port = process.env.npm_config_port || process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Sever started at port ${port}`);
})


