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
exports.commentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const comment_model_1 = __importDefault(require("./comment.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const insertComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.create(payload);
    return comment;
});
const getAllComments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const commentQuery = new QueryBuilder_1.default(comment_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort}` }))
        .searchQuery([])
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'post', select: '-createdAt -updatedAt -__v' },
        { path: 'user', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield (commentQuery === null || commentQuery === void 0 ? void 0 : commentQuery.queryModel);
    const total = yield comment_model_1.default.countDocuments(commentQuery.queryModel.getFilter());
    return { data: result, total };
});
const getCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findById(id).select('-__v');
    if (!comment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Comment not found!');
    }
    return comment;
});
const updateCommentById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!comment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Comment not found!');
    }
    return comment;
});
const deleteCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findByIdAndDelete(id);
    if (!comment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Comment not found!');
    }
    return comment;
});
exports.commentServices = {
    insertComment,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById,
};
