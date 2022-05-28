const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require("path");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})
const upload = multer({storage});

// Route imports
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

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

app.use(cors());
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(morgan('common'));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// APIs

app.get('/', (req, res) => {
    res.send('Welcome to my App');
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.send({
            success: true,
            message: `File uploaded successfully`
        });
    } catch (error) {
        return res.send({
            success: true,
            message: `Something went wrong`,
            error
        });
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});