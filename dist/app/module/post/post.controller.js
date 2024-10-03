"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const post_service_1 = require("./post.service");
// Insert a new post
const insertPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.user;
    const post = yield post_service_1.postServices.insertPost(req.file, author, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Post inserted successfully!',
        data: post,
    });
}));
// Get all posts
const getAllPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield post_service_1.postServices.getAllPosts(req.query); // Change to getAllTravelers
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Posts retrieved successfully!', // Update message
        data,
        meta: { total, page, totalPage, limit },
    });
}));
// Get a single post by ID
const getPostById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const post = yield post_service_1.postServices.getPostById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!post) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Post not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Post retrieved successfully!',
        data: post,
    });
}));
// Update a single post by ID
const updatePostById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const author = req.user;
    const post = yield post_service_1.postServices.updatePostById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.file, author, req.body);
    if (!post) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Post not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Post updated successfully!',
        data: post,
    });
}));
// Delete a single post by ID
const deletePostById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const author = req.user;
    const post = yield post_service_1.postServices.deletePostById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, author);
    if (!post) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Post not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Post deleted successfully!',
        data: post,
    });
}));
exports.postController = {
    insertPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
};
