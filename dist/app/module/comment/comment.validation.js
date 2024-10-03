"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentZodSchema = exports.createCommentZodSchema = void 0;
const zod_1 = require("zod");
const createCommentZodSchema = zod_1.z.object({
    user: zod_1.z.string({ required_error: 'User Id is required' }),
    post: zod_1.z.string({ required_error: 'Post Id is required' }),
    comment: zod_1.z.string({ required_error: 'Comment is required' }),
});
exports.createCommentZodSchema = createCommentZodSchema;
const updateCommentZodSchema = zod_1.z.object({
    user: zod_1.z.string().optional(),
    post: zod_1.z.string().optional(),
    comment: zod_1.z.string().optional(),
});
exports.updateCommentZodSchema = updateCommentZodSchema;
