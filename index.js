const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

// Get config data from .env file
dotenv.config();

const port = process.env.PORT || 8000; // Port number

// Connect to Mongo DB
mongoose.connect(
    process.env.MONGO_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {
    console.log('Connected to Mongo DB');
});

// Use middlewares

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});