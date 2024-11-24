"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PackageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        enum: [
            'Basic',
            'Standard',
            'Premium',
            'Explorer',
            'Backpacker',
            'Adventurer',
        ], // List of available plans
        unique: true,
    },
    shortBio: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0, // Default price
    },
    durationInMonths: {
        type: Number,
        required: true,
        default: 1, // Default to 1 month
        min: 1,
    },
    benefits: {
        type: [String],
        required: true,
    },
    currencyType: {
        type: String,
        default: 'BDT', // Default currency type
        enum: ['BDT', 'USD', 'EUR'], // Add more currencies as needed
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Package = (0, mongoose_1.model)('Package', PackageSchema);
exports.default = Package;
