"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Traveler',
        required: [true, 'User is required'],
    },
    post: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post is required'],
    },
    comment: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
    },
}, { timestamps: true });
// Comment model export
const Comment = (0, mongoose_1.model)('Comment', CommentSchema);
exports.default = Comment;
