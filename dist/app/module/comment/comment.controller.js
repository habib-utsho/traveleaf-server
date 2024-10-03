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
exports.commentController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const comment_service_1 = require("./comment.service");
// Insert a new comment
const insertComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_service_1.commentServices.insertComment(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Comment inserted successfully!',
        data: comment,
    });
}));
// Get all comments
const getAllComments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_service_1.commentServices.getAllComments(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Comments retrieved successfully!',
        data: comments,
    });
}));
// Get a single comment by ID
const getCommentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const comment = yield comment_service_1.commentServices.getCommentById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!comment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Comment not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Comment retrieved successfully!',
        data: comment,
    });
}));
// Update a single comment by ID
const updateCommentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const comment = yield comment_service_1.commentServices.updateCommentById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.body);
    if (!comment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Comment not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Comment updated successfully!',
        data: comment,
    });
}));
// Delete a single comment by ID
const deleteCommentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const comment = yield comment_service_1.commentServices.deleteCommentById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!comment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Comment not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Comment deleted successfully!',
        data: comment,
    });
}));
exports.commentController = {
    insertComment,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById,
};
