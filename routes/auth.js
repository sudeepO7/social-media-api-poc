const router = require('express').Router();
const User = require("../models/User");
const { getEncryptedPassword, compareEncryptedPassword, handleException } = require('../helpers/Helper');
const { validateRegisterUser, validateLoginUser } = require('../helpers/Validator');
const { MESSAGES, STATUS_CODES } = require('../helpers/Constant');
const { NOT_FOUND, BAD_REQUEST, CREATED } = STATUS_CODES;

// Register User
router.post('/register', async (req, res) => {
    try {
        // Request validation
        if (!validateRegisterUser(req, res))
            return false;
        
        // Get request parameters
        const { username, firstName, lastName, email, password, ...others } = req.body;

        // Encrypt/hash the password
        const hashedpass = await getEncryptedPassword(password);

        // Create new user
        const newUser = await new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedpass,
            ...others
        });
        newUser.save().then(data => {
            // Return success
            return res.status(CREATED).send({
                success: true,
                message: MESSAGES.USER_CREATED,
                user: newUser
            });
        }).catch(error => {
            // Handle exception and return error
            console.log('register user | error ==> ', error);
            return handleException(res, error);
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
    
});

// User Login
router.post('/login', async (req, res) => {
    try {
        // Request validation
        if (!validateLoginUser(req, res))
            return false;

        // Get request parameters
        const { username, email, password } = req.body;

        // Check user
        let user;
        if (username)
            user = await User.findOne({ username });
        else
            user = await User.findOne({ email });
        if (!user)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.USER_NOT_FOUND
            });
        
        // Check password
        const validPass = await compareEncryptedPassword(password, user.password);
        if (!validPass)
            return res.status(BAD_REQUEST).send({
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