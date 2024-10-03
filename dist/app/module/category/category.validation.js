"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryZodSchema = exports.createCategoryZodSchema = void 0;
const zod_1 = require("zod");
const createCategoryZodSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: 'Category name is required' }),
});
exports.createCategoryZodSchema = createCategoryZodSchema;
const updateCategoryZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
});
exports.updateCategoryZodSchema = updateCategoryZodSchema;
