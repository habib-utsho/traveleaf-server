"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionZodSchema = void 0;
const zod_1 = require("zod");
// Define Zod schema for creating a subscription
const createSubscriptionZodSchema = zod_1.z.object({
    user: zod_1.z.string({
        required_error: 'User ID is required',
    }),
    package: zod_1.z.string({
        required_error: 'Package ID is required',
    }),
    isActive: zod_1.z.boolean().optional().default(true), // Default to active if not provided
});
exports.createSubscriptionZodSchema = createSubscriptionZodSchema;
