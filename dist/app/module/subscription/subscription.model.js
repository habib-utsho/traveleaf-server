"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Traveler', // Reference to User model
    },
    package: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Package', // Reference to Package model
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true, // Active or inactive subscription
    },
}, { timestamps: true });
const Subscription = (0, mongoose_1.model)('Subscription', SubscriptionSchema);
exports.default = Subscription;
