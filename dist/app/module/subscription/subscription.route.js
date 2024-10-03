"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRouter = void 0;
const express_1 = require("express");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const subscription_controller_1 = require("./subscription.controller");
const subscription_validation_1 = require("./subscription.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
exports.subscriptionRouter = router;
// Create a new subscription
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.TRAVELER), (0, zodValidateHandler_1.default)(subscription_validation_1.createSubscriptionZodSchema), subscription_controller_1.subscriptionController.insertSubscription);
// Get all subscriptions
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), subscription_controller_1.subscriptionController.getAllSubscriptions);
// Get a single subscription by ID
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), subscription_controller_1.subscriptionController.getSubscriptionById);
// Delete a subscription by ID
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), subscription_controller_1.subscriptionController.deleteSubscriptionById);
