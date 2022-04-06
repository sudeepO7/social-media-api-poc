const router = require('express').Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { validateUserId } = require('../helpers/Validator');
const { handleException } = require('../helpers/Helper');
const { MESSAGES, STATUS_CODES } = require('../helpers/Constant');
const { NOT_FOUND, FORBIDDEN, CREATED, SUCCESS } = STATUS_CODES;

// Create posts
router.post('/', async (req, res) => {
    try {
        // Request validation
        if (!validateUserId(req, res))
            return false;

        // Create new posts
        const newPosts = new Post(req.body);
        newPosts.save();

        // Return success
        return res.status(CREATED).send({
            success: true,
            message: MESSAGES.POST_CREATED,
            post: newPosts
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Update posts
router.put('/:id', async (req, res) => {
    try {
        // Request validation
        if (!validateUserId(req, res))
            return false;
        
        // Fetch request parameters
        const { userId } = req.body;
        const { id } = req.params;

        // Check whether post exists
        const post = await Post.findById(id);
        
        if (!post)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.POST_NOT_FOUND
            });

        if (post.userId === userId) {
            // Update post
            await post.updateOne(req.body);

            // Return success
            return res.status(SUCCESS).send({
                success: true,
                message: MESSAGES.POST_UPDATED
            });
        } else {
            // Handle unauthorized access scenario
            return res.status(FORBIDDEN).send({
                success: false,
                message: MESSAGES.CAN_NOT_UPDATE_POST
            });
        }
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Delete posts
router.delete('/:id', async (req, res) => {
    try {
        // Request validation
        if (!validateUserId(req, res))
            return false;
        
        // Fetch request parameters
        const { userId } = req.body;
        const { id } = req.params;

        // Check whether post exists
        const post = await Post.findById(id);
        
        if (!post)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.POST_NOT_FOUND
            });

        if (post.userId === userId) {
            // Delete post
            await post.deleteOne();

            // Return success
            return res.status(SUCCESS).send({
                success: true,
                message: MESSAGES.POST_DELETED
            });
        } else {
            // Handle unauthorized access scenario
            return res.status(FORBIDDEN).send({
                success: false,
                message: MESSAGES.CAN_NOT_DELETE_POST
            });
        }
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Like/Unlike posts
router.put('/:id/like', async (req, res) => {
    try {
        // Request validation
        if (!validateUserId(req, res))
            return false;
        
        // Fetch request parameters
        const { userId } = req.body;
        const { id } = req.params;

        // Check whether post exists
        const post = await Post.findById(id);
        
        if (!post)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.POST_NOT_FOUND
            });

        let resMsg;
        if (!post.likes.includes(userId)) {
            // Like post
            await post.updateOne({
                $push: {
                    likes: userId
                }
            });
            resMsg = MESSAGES.POST_LIKED;
        } else {
            // Unlike post
            await post.updateOne({
                $pull: {
                    likes: userId
                }
            });
            resMsg = MESSAGES.POST_UNLIKED;
        }

        // Return success
        return res.status(SUCCESS).send({
            success: true,
            message: resMsg
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Get posts
router.get('/:id', async (req, res) => {
    try {
        // Fetch request parameters
        const { id } = req.params;

        // Check whether post exists
        const post = await Post.findById(id);
        
        if (!post)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.POST_NOT_FOUND
            });

        // Return success
        return res.status(SUCCESS).send({
            success: true,
            post
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Get Timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        // Request validation
        if (!validateUserId(req, res))
            return false;
        
        // Fetch request parameters
        const { userId } = req.body;

        // Get current user
        const currentUser = await User.findById(userId);
        
        if (!currentUser)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.USER_NOT_FOUND
            });

        // Fetch user's and it's follower's posts
        const currentUserPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
            currentUser.followers.map(friendsId => Post.find({ userId: friendsId }))
        );

        // Return posts
        return res.send({
            success: true,
            posts: currentUserPosts.concat(...friendsPosts)
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

module.exports = router;