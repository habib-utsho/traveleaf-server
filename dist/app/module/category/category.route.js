"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant"); // Assuming USER_ROLE is from user module, keep it or update as needed
const category_validation_1 = require("./category.validation");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.categoryRouter = router;
// Create a new category
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, zodValidateHandler_1.default)(category_validation_1.createCategoryZodSchema), category_controller_1.categoryController.insertCategory);
// Get all categories
router.get('/', category_controller_1.categoryController.getAllCategories);
// Get a single category by ID
router.get('/:id', category_controller_1.categoryController.getCategoryById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, zodValidateHandler_1.default)(category_validation_1.updateCategoryZodSchema), category_controller_1.categoryController.updateCategoryById);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), category_controller_1.categoryController.deleteCategoryById);
