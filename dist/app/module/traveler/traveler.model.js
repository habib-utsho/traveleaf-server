"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const traveler_constant_1 = require("./traveler.constant");
const travelerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
    },
    postsCount: {
        type: Number,
        default: 0,
    },
    profileImg: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other '],
    },
    status: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    followers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Traveler',
    },
    following: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Traveler',
    },
    district: {
        type: String,
        required: true,
        enum: traveler_constant_1.districts,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Traveler Model
const Traveler = (0, mongoose_1.model)('Traveler', travelerSchema);
exports.default = Traveler;
