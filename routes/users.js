const router = require('express').Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');

// Constants
const MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Something went wrong',
    CAN_NOT_UPDATE: `You can not update this user's details`,
    CAN_NOT_DELETE: `You can not delete this user's account`,
    USER_UPDATED: 'User details updated',
    USER_DELETED: 'User account deleted',
    USER_NOT_FOUND: 'User not found',
    ALREADY_FOLLOWING: 'Already following this user',
    ALREADY_UNFOLLOWING: 'You do not follow this user',
    CAN_NOT_FOLLOW_SELF: 'You can not follow yourself',
    CAN_NOT_UNFOLLOW_SELF: 'You can not unfollow yourself'
};
const handleException = (res, error) => {
    return res.status(500).send({
        success: false,
        message: MESSAGES.DEFAULT_ERROR_MESSAGE,
        error
    });
};

// Update user
router.put('/:id', async (req, res) => {
    try {
        // Get request parameters
        const { userId, password, isAdmin } = req.body;
        const { id } = req.params;

        // Check whether user can update details or not
        if (userId === id || isAdmin) {
            // Encrypt/hash the password if present
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            // Update user details
            await User.findByIdAndUpdate(id, {
                $set: req.body
            });

            // Return success
            return res.send({
                success: true,
                message: MESSAGES.USER_UPDATED
            });
        } else {
            // Handle unauthorized access scenario
            return res.status(403).send({
                success: false,
                message: MESSAGES.CAN_NOT_UPDATE
            });
        }
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }    
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        // Get request parameters
        const { userId, isAdmin } = req.body;
        const { id } = req.params;

        // Check whether user can delete account or not
        if (userId === id || isAdmin) {
            // Delete user account
            await User.findByIdAndDelete(id);

            // Return success
            return res.send({
                success: true,
                message: MESSAGES.USER_DELETED
            });
        } else {
            // Handle unauthorized access scenario
            return res.status(403).send({
                success: false,
                message: MESSAGES.CAN_NOT_DELETE
            });
        }
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }    
});

// Get a user
router.get('/:id', async (req, res) => {
    try {
        // Get request parameters
        const { id } = req.params;

        // Get user account
        const user = await User.findById(id);
        
        // Check user found or not
        if (!user)
            return res.status(404).send({
                success: false,
                message: MESSAGES.USER_NOT_FOUND
            });
            
        const { password, updatedAt, createdAt, __v, ...others } = user._doc;
        // Return success
        return res.send({
            success: true,
            user: others
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }    
});

// Follow user
router.put('/:id/follow', async (req, res) => {
    try {
        // Get request parameters
        const { userId } = req.body;
        const { id } = req.params;

        // Check whether user following itself or not
        if (userId !== id) {
            // Get user and current user
            const user = await User.findById(id);
            const currentUser = await User.findById(userId);

            // Check whether user already following
            if (!user.followers.includes(userId)) {
                await user.updateOne({
                    $push: {
                        followers: userId
                    }
                });
                await currentUser.updateOne({
                    $push: {
                        following: id
                    }
                });

                // Return success
                return res.send({
                    success: true,
                    message: `You have started following ${user.username}`
                });
            } else {
                // Handle user already following
                return res.status(403).send({
                    success: false,
                    message: MESSAGES.ALREADY_FOLLOWING
                }); 
            }
        } else {
            // Handle unauthorized access scenario
            return res.status(403).send({
                success: false,
                message: MESSAGES.CAN_NOT_FOLLOW_SELF
            });
        }
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }    
});

// Unfollow user
router.put('/:id/unfollow', async (req, res) => {
    try {
        // Get request parameters
        const { userId } = req.body;
        const { id } = req.params;

        // Check whether user unfollowing itself or not
        if (userId !== id) {
            // Get user and current user
            const user = await User.findById(id);
            const currentUser = await User.findById(userId);

            // Check whether user is following or not
            if (user.followers.includes(userId)) {
                await user.updateOne({
                    $pull: {
                        followers: userId
                    }
                });
                await currentUser.updateOne({
                    $pull: {
                        following: id
                    }
                });

                // Return success
                return res.send({
                    success: true,
                    message: `You have unfollowed ${user.username}`
                });
            } else {
                // Handle user already following
                return res.status(403).send({
                    success: false,
                    message: MESSAGES.ALREADY_UNFOLLOWING
                }); 
            }
        } else {
            // Handle unauthorized access scenario
            return res.status(403).send({
                success: false,
                message: MESSAGES.CAN_NOT_UNFOLLOW_SELF
            });
        }
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }    
});

module.exports = router;