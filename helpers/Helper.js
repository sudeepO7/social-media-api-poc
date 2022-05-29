const bcrypt = require("bcrypt");
const { MESSAGES, STATUS_CODES } = require('./Constant');
const User = require("../models/User");

// Get encrypted/hashed password
const getEncryptedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare encrypted/hashed passwords
const compareEncryptedPassword = async (pass1, pass2) => {
    return await bcrypt.compare(pass1, pass2);
};

// Return exception error response
const handleException = (res, error) => {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: MESSAGES.DEFAULT_ERROR_MESSAGE,
        error
    });
};

// Get Users list

const getUserList = async (userIds) => {
    try {
        const userList = await User.find({ _id: { $in: userIds } }, {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1
        });
        return userList;
    } catch (err) {
        console.log('getUserList | err ==> ', err);
        return [];
    }
};

module.exports = {
    getEncryptedPassword,
    compareEncryptedPassword,
    handleException,
    getUserList
};