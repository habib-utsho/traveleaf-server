"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Pre-save hook to auto-generate slug from name
CategorySchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, {
        lower: true,
        strict: true,
        replacement: '_',
    });
    console.log('create middlware', this.name, this.slug);
    next();
});
CategorySchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    // Check if 'name' is being updated
    if (update === null || update === void 0 ? void 0 : update.name) {
        update.slug = (0, slugify_1.default)(update.name, {
            lower: true,
            strict: true,
            replacement: '_',
        });
        this.setUpdate(update);
    }
    next();
});
const Category = (0, mongoose_1.model)('Category', CategorySchema);
exports.default = Category;
