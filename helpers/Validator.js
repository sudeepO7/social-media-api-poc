
const { STATUS_CODES } = require('./Constant');
const { BAD_REQUEST } = STATUS_CODES;

// Validate register user requests
const validateRegisterUser = (req, res) => {
    const mandatoryFields = ['username', 'firstName', 'lastName', 'email', 'password'];
    const requestFields = Object.keys(req.body), missingFields = [];
    mandatoryFields.forEach(field => {
        if (!requestFields.includes(field))
            missingFields.push(field);
    });
    if (missingFields.length > 0) {
        res.status(BAD_REQUEST).send({
            success: false,
            message: `Required fields ${missingFields.join(',')} are missing`
        });
        return false;
    }
    return true;
};

// Validate login user requests
const validateLoginUser = (req, res) => {
    const requestFields = Object.keys(req.body);
    if ((!requestFields.includes('username') && !requestFields.includes('email')) ||
        !requestFields.includes('password')) {
        res.status(BAD_REQUEST).send({
            success: false,
            message: `Required fields username/email and password are needed`
        });
        return false;
    }
    return true;
};

// Validate user id in requests
const validateUserId = (req, res) => {
    if (!req.body.userId && !req.params.userId) {
        res.status(BAD_REQUEST).send({
            success: false,
            message: `Required field userId is missing`
        });
        return false;
    }
    return true;
};

// Validate username in requests
const validateUsername = (req, res) => {
    if (!req.body.username && !req.params.username) {
        res.status(BAD_REQUEST).send({
            success: false,
            message: `Required field username is missing`
        });
        return false;
    }
    return true;
};

module.exports = {
    validateRegisterUser,
    validateLoginUser,
    validateUserId,
    validateUsername
};