const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

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

// APIs

app.get('/', (req, res) => {
    res.send('Welcome to my App');
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});