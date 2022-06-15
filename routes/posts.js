const router = require('express').Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { validateUserId, validateUsername } = require('../helpers/Validator');
const { handleException, getUserList } = require('../helpers/Helper');
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
        
        // Get user details
        const usersList = await getUserList([post.userId]);
        const { _id, userId, desc, likes, createdAt, updatedAt, img } = post;
        const { username, firstName, lastName, profilePicture } = usersList[0] ? usersList[0] : {};
        // Return success
        return res.status(SUCCESS).send({
            success: true,
            post: {
                _id, userId, desc, likes, createdAt, updatedAt, img,
                username, firstName, lastName, profilePicture
            }
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Get Timeline posts
router.get('/timeline/:userId', async (req, res) => {
    try {
        // Request validation
        if (!validateUserId(req, res))
            return false;
        
        // Fetch request parameters
        const { userId } = req.params;

        // Get current user
        const currentUser = await User.findById(userId, { 
            password: 0, isAdmin: 0
        });
        
        if (!currentUser)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.USER_NOT_FOUND
            });

        // Fetch user's and it's follower's posts
        const friendsList = [currentUser._id];
        currentUser.following.forEach(friendsId => {
            if (!friendsList.includes(friendsId))
                friendsList.push(friendsId);
        })
        let allPosts = await Post.find({ userId: { $in: friendsList } }).sort({createdAt: -1});

        // Get profile picture and name of the friends
        const usersList = await getUserList(friendsList);

        // Merge post details and user's profile picture and name
        allPosts = allPosts.map(post => {
            const { _id, userId, desc, likes, createdAt, updatedAt, img } = post;
            let userDetails = {};
            const friend = usersList.filter(user => user._id.toString() === post.userId)[0];
            if (friend) {
                const { username, firstName, lastName, profilePicture } = friend;
                userDetails = { username, firstName, lastName, profilePicture };
            }
            return {
                _id, userId, desc, likes, createdAt, updatedAt, img,
                ...userDetails
            }
        });

        // Return posts
        return res.send({
            success: true,
            posts: allPosts,
            user: currentUser
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

// Get user's all posts
router.get('/profile/:username', async (req, res) => {
    try {
        // Request validation
        if (!validateUsername(req, res))
            return false;
        
        // Fetch request parameters
        const { username } = req.params;

        // Get user details
        const userDetails = await User.findOne({ username }, { 
            password: 0, isAdmin: 0
        });
        
        if (!userDetails)
            return res.status(NOT_FOUND).send({
                success: false,
                message: MESSAGES.USER_NOT_FOUND
            });

        // Fetch user's posts
        let userPosts = await Post.find({ userId: userDetails._id }).sort({createdAt: -1});
        userPosts = userPosts.map(post => {
            const { _id, userId, desc, likes, createdAt, updatedAt, img } = post;
            const { username, firstName, lastName, profilePicture } = userDetails;
            return {
                _id, userId, desc, likes, createdAt, updatedAt, img,
                username, firstName, lastName, profilePicture
            }
        });

        // Return posts
        return res.send({
            success: true,
            posts: userPosts,
            user: userDetails
        });
    } catch(error) {
        // Handle exception and return error
        return handleException(res, error);
    }
});

module.exports = router;