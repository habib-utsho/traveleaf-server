"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant"); // Assuming USER_ROLE is from user module, keep it or update as needed
const comment_validation_1 = require("./comment.validation");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.commentRouter = router;
// Create a new comment
router.post('/', (0, zodValidateHandler_1.default)(comment_validation_1.createCommentZodSchema), comment_controller_1.commentController.insertComment);
// Get all comments
router.get('/', comment_controller_1.commentController.getAllComments);
// Get a single comment by ID
router.get('/:id', comment_controller_1.commentController.getCommentById);
// Update a comment by ID
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, zodValidateHandler_1.default)(comment_validation_1.updateCommentZodSchema), comment_controller_1.commentController.updateCommentById);
// Delete a comment by ID
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), comment_controller_1.commentController.deleteCommentById);
