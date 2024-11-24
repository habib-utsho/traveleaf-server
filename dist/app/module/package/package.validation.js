"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageZodSchema = exports.createPackageZodSchema = void 0;
const zod_1 = require("zod");
// Define Zod schema for creating a package
const createPackageZodSchema = zod_1.z.object({
    name: zod_1.z.enum(['Basic', 'Standard', 'Premium', 'Explorer', 'Backpacker', 'Adventurer'], {
        required_error: 'Package name is required',
    }),
    shortBio: zod_1.z.string({ required_error: 'Short bio is required' }),
    description: zod_1.z.string({ required_error: 'Package description is required' }),
    benefits: zod_1.z.array(zod_1.z.string({ required_error: 'Benefits is required' })),
    currencyType: zod_1.z.enum(['BDT', 'USD', 'EUR']).optional().default('BDT'), // Default to BDT if not provided
    isDeleted: zod_1.z.boolean().optional().default(false), // Default to false
});
exports.createPackageZodSchema = createPackageZodSchema;
// Define Zod schema for updating a package
const updatePackageZodSchema = zod_1.z.object({
    name: zod_1.z
        .enum([
        'Basic',
        'Standard',
        'Premium',
        'Explorer',
        'Backpacker',
        'Adventurer',
    ])
        .optional(),
    shortBio: zod_1.z.string({ required_error: 'Short bio is required' }),
    description: zod_1.z.string().optional(),
    price: zod_1.z
        .number()
        .min(0, { message: 'Price must be a non-negative number' })
        .optional(),
    durationInMonths: zod_1.z
        .number()
        .min(1, { message: 'Duration must be at least 1 month' })
        .optional(),
    currencyType: zod_1.z.enum(['BDT', 'USD', 'EUR']).optional(),
    benefits: zod_1.z.array(zod_1.z.string()).optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.updatePackageZodSchema = updatePackageZodSchema;
