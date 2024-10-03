"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostZodSchema = exports.createPostZodSchema = void 0;
const zod_1 = require("zod");
// Post creation schema
const createPostZodSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Title is required' }),
    content: zod_1.z.string({ required_error: 'Content is required' }),
    category: zod_1.z.string({ required_error: 'Category is required' }),
    isPremium: zod_1.z.boolean().optional(), // Optional, default false in the model
});
exports.createPostZodSchema = createPostZodSchema;
// Post update schema
const updatePostZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    isPremium: zod_1.z.boolean().optional(),
});
exports.updatePostZodSchema = updatePostZodSchema;
