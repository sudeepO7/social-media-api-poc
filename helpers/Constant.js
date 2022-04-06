// Constants

// Response messages
const MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Something went wrong',
    CAN_NOT_UPDATE_USER: `You can not update this user's details`,
    CAN_NOT_DELETE_USER: `You can not delete this user's account`,
    USER_UPDATED: 'User details updated',
    USER_DELETED: 'User account deleted',
    ALREADY_FOLLOWING: 'Already following this user',
    ALREADY_UNFOLLOWING: 'You do not follow this user',
    CAN_NOT_FOLLOW_SELF: 'You can not follow yourself',
    CAN_NOT_UNFOLLOW_SELF: 'You can not unfollow yourself',
    USER_CREATED: 'User created successfully',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_NOT_MATCH: 'Invalid password',
    POST_CREATED: 'Post created successfully',
    POST_UPDATED: 'Post updated successfully',
    POST_DELETED: 'Post deleted successfully',
    POST_NOT_FOUND: 'Post not found',
    CAN_NOT_UPDATE_POST: `You can not update this post`,
    CAN_NOT_DELETE_POST: `You can not delete this post`,
    POST_LIKED: 'Post liked',
    POST_UNLIKED: 'Post unliked'
};

// Response status codes
const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TIMEOUT: 408,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

module.exports = {
    MESSAGES,
    STATUS_CODES
};