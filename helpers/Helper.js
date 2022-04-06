const bcrypt = require("bcrypt");
const { MESSAGES, STATUS_CODES } = require('./Constant');

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

module.exports = {
    getEncryptedPassword,
    compareEncryptedPassword,
    handleException
};