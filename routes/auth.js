const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Constants
const MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Something went wrong',
    USER_CREATED: 'User created successfully',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_NOT_MATCH: 'Invalid password'
};
const handleException = (res, error) => {
    return res.status(500).send({
        success: false,
        message: MESSAGES.DEFAULT_ERROR_MESSAGE,
        error
    });
};

// Register User
router.post('/register', async (req, res) => {
    try {
        // Get request parameters
        const { username, firstName, lastName, email, password } = req.body;

        // Encrypt/hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedpass
        });
        await newUser.save();

        // Return success
        return res.send({
            success: true,
            message: MESSAGES.USER_CREATED
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
    
});

// User Login
router.post('/login', async (req, res) => {
    try {
        // Get request parameters
        const { username, email, password } = req.body;

        // Check user
        let user;
        if (username)
            user = await User.findOne({ username });
        else
            user = await User.findOne({ email });
        if (!user)
            return res.status(404).send({
                success: false,
                message: MESSAGES.USER_NOT_FOUND
            });
        
        // Check password
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass)
            return res.status(400).send({
                success: false,
                message: MESSAGES.PASSWORD_NOT_MATCH
            });
        
        // Return success
        return res.send({
            success: true,
            user
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
        
});

module.exports = router;