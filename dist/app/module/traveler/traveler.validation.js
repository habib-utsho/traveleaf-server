"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTravelerZodSchema = exports.createTravelerZodSchema = void 0;
const zod_1 = require("zod");
const createTravelerZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required.'),
    email: zod_1.z.string().email('Invalid email format.'),
    phone: zod_1.z
        .string()
        .min(10, 'Phone number must be at least 10 characters long.')
        .regex(/^\d+$/, 'Phone number must contain only digits.'),
    bio: zod_1.z.string().min(1, 'Bio is required.'),
    gender: zod_1.z.enum(['Male', 'Female', 'Other'], {
        required_error: 'Gender is required.',
    }),
    district: zod_1.z.enum([
        'Dhaka',
        'Faridpur',
        'Gazipur',
        'Gopalganj',
        'Jamalpur',
        'Kishoreganj',
        'Madaripur',
        'Manikganj',
        'Munshiganj',
        'Mymensingh',
        'Narayanganj',
        'Narsingdi',
        'Netrokona',
        'Rajbari',
        'Shariatpur',
        'Sherpur',
        'Tangail',
        'Bogra',
        'Joypurhat',
        'Naogaon',
        'Natore',
        'Chapainawabganj',
        'Pabna',
        'Rajshahi',
        'Sirajganj',
        'Dinajpur',
        'Gaibandha',
        'Kurigram',
        'Lalmonirhat',
        'Nilphamari',
        'Panchagarh',
        'Rangpur',
        'Thakurgaon',
        'Barguna',
        'Barishal',
        'Bhola',
        'Jhalokati',
        'Patuakhali',
        'Pirojpur',
        'Bandarban',
        'Brahmanbaria',
        'Chandpur',
        'Chattogram',
        'Cumilla',
        "Cox's Bazar",
        'Feni',
        'Khagrachari',
        'Lakshmipur',
        'Noakhali',
        'Rangamati',
        'Habiganj',
        'Moulvibazar',
        'Sunamganj',
        'Sylhet',
        'Bagerhat',
        'Chuadanga',
        'Jessore',
        'Jhenaidah',
        'Khulna',
        'Kushtia',
        'Magura',
        'Meherpur',
        'Narail',
        'Satkhira',
    ], { required_error: 'District is required.' }),
    dateOfBirth: zod_1.z
        .string({ required_error: 'Date of birth is required.' })
        .refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid date format.',
    }),
    isDeleted: zod_1.z.boolean().default(false).optional(), // Default value
});
exports.createTravelerZodSchema = createTravelerZodSchema;
const updateTravelerZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required.').optional(),
    phone: zod_1.z
        .string()
        .min(10, 'Phone number must be at least 10 characters long.')
        .regex(/^\d+$/, 'Phone number must contain only digits.')
        .optional(),
    bio: zod_1.z.string().min(1, 'Bio is required.').optional(),
    gender: zod_1.z
        .enum(['Male', 'Female', 'Other'], {
        required_error: 'Gender is required.',
    })
        .optional(),
    dateOfBirth: zod_1.z
        .string({ required_error: 'Date of birth is required.' })
        .refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid date format.',
    })
        .optional(),
    isDeleted: zod_1.z.boolean().default(false).optional(), // Default value
});
exports.updateTravelerZodSchema = updateTravelerZodSchema;
