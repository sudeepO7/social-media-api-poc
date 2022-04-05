const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        min: 3
    },
    middleName: {
        type: String,
        min: 1
    },
    lastName: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        max: 60,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        max: 100
    },
    city: {
        type: String,
        max: 45
    },
    state: {
        type: String,
        max: 45
    },
    relationship: {
        type: Number,
        enum: [1,2,3]
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);