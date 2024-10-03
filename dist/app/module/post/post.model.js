"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Post Schema definition
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    banner: {
        type: String,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        refPath: 'authorType', // Dynamically set ref based on authorType
    },
    authorType: {
        type: String,
        enum: ['Traveler', 'Admin'], // Allow only specific types
    },
    category: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    upvotedBy: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Traveler',
        },
    ],
    downvotedBy: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Traveler',
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Post model export
const Post = (0, mongoose_1.model)('Post', PostSchema);
exports.default = Post;
