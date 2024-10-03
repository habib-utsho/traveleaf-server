"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageRouter = void 0;
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const package_controller_1 = require("./package.controller"); // Ensure the correct controller is imported
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant"); // Assuming USER_ROLE is from user module
const package_validation_1 = require("./package.validation"); // Ensure the correct validation is imported
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.packageRouter = router;
// Create a new package
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), // Assuming only admin can create packages
(0, zodValidateHandler_1.default)(package_validation_1.createPackageZodSchema), package_controller_1.packageController.insertPackage);
// Get all packages
router.get('/', package_controller_1.packageController.getAllPackages); // Adjust the method name in the controller
// Get a single package by ID
router.get('/:id', package_controller_1.packageController.getPackageById); // Adjust the method name in the controller
// Update a package by ID
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, zodValidateHandler_1.default)(package_validation_1.updatePackageZodSchema), package_controller_1.packageController.updatePackageById);
// Delete a package by ID
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), package_controller_1.packageController.deletePackageById);
