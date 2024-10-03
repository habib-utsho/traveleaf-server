"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const post_controller_1 = require("./post.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant"); // Assuming USER_ROLE is from the user module, keep it or update as needed
const post_validation_1 = require("./post.validation");
const express_1 = require("express");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.postRouter = router;
// Create a new post
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(post_validation_1.createPostZodSchema), post_controller_1.postController.insertPost);
// Get all posts
router.get('/', post_controller_1.postController.getAllPosts);
// Get a single post by ID
router.get('/:id', post_controller_1.postController.getPostById);
// Update a post by ID
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(post_validation_1.updatePostZodSchema), post_controller_1.postController.updatePostById);
// Delete a post by ID
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), post_controller_1.postController.deletePostById);
