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
exports.postServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const post_model_1 = __importDefault(require("./post.model")); // Ensure this imports the correct Post model
const appError_1 = __importDefault(require("../../errors/appError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const post_constant_1 = require("./post.constant");
const user_model_1 = __importDefault(require("../user/user.model"));
const traveler_model_1 = __importDefault(require("../traveler/traveler.model"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// Function to insert a new post
const insertPost = (file, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // const author = req.usr
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const existAuthorUser = yield user_model_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        let existAuthor;
        if ((existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.role) === 'admin') {
            existAuthor = yield admin_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
        }
        if ((existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.role) === 'traveler') {
            existAuthor = yield traveler_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
        }
        if (!existAuthorUser || !existAuthor) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Author not found!');
        }
        // const existUser = await User.findById(existAuthor.user)
        const isAlreadyExistUpvote = yield post_model_1.default.findOne({
            author: existAuthor._id,
            upvotes: { $gt: 0 },
        });
        if (payload.isPremium === true &&
            (!isAlreadyExistUpvote || (existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.status) !== 'premium')) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User must be premium and have at least one upvote to create a premium post!');
        }
        // file upload
        if (file === null || file === void 0 ? void 0 : file.path) {
            const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`traveleaf-${Date.now()}`, file.path);
            if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
                payload.banner = cloudinaryRes.secure_url;
            }
        }
        existAuthor.postsCount += 1;
        yield existAuthor.save({ session });
        const post = yield post_model_1.default.create([
            Object.assign(Object.assign({}, payload), { author: existAuthor._id, authorType: `${(_b = (_a = existAuthorUser.role) === null || _a === void 0 ? void 0 : _a.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()}${(_c = existAuthorUser.role) === null || _c === void 0 ? void 0 : _c.slice(1)}` }),
        ], { session });
        yield session.commitTransaction();
        yield session.endSession();
        return post[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const postQuery = new QueryBuilder_1.default(post_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} -createdAt` }))
        .searchQuery(post_constant_1.postSearchableField)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'author', select: '-createdAt -updatedAt -__v' },
        { path: 'category', select: '-createdAt -updatedAt -__v' },
        { path: 'upvotedBy', select: '-createdAt -updatedAt -__v' },
        { path: 'downvotedBy', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield (postQuery === null || postQuery === void 0 ? void 0 : postQuery.queryModel);
    const total = yield post_model_1.default.countDocuments(postQuery.queryModel.getFilter());
    return { data: result, total };
});
// Function to get a post by ID
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findById(id)
        .select('-__v')
        .populate('category')
        .populate('author')
        .populate('downvotedBy')
        .populate('upvotedBy');
    if (!post) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Post not found!');
    }
    return post;
});
// Function to update a post by ID
const updatePostById = (id, file, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existPost = yield post_model_1.default.findById(id);
    const existAuthorUser = yield user_model_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
    let existAuthor;
    if ((existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.role) === 'admin') {
        existAuthor = yield admin_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    }
    if ((existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.role) === 'traveler') {
        existAuthor = yield traveler_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    }
    if (!existAuthorUser || !existAuthor) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Author not found!');
    }
    if (((_a = existPost === null || existPost === void 0 ? void 0 : existPost.author) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = existAuthor === null || existAuthor === void 0 ? void 0 : existAuthor._id) === null || _b === void 0 ? void 0 : _b.toString())) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not allowed to update this post!');
    }
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`traveleaf-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            payload.banner = cloudinaryRes.secure_url;
        }
    }
    const post = yield post_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!post) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Post not found!');
    }
    return post;
});
// Function to delete a post by ID
const deletePostById = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existPost = yield post_model_1.default.findById(id);
    const existAuthorUser = yield user_model_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
    let existAuthor;
    if ((existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.role) === 'admin') {
        existAuthor = yield admin_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    }
    if ((existAuthorUser === null || existAuthorUser === void 0 ? void 0 : existAuthorUser.role) === 'traveler') {
        existAuthor = yield traveler_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    }
    if (!existAuthorUser || !existAuthor) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Author not found!');
    }
    if (existAuthorUser.role !== 'admin') {
        if (((_a = existPost === null || existPost === void 0 ? void 0 : existPost.author) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = existAuthor === null || existAuthor === void 0 ? void 0 : existAuthor._id) === null || _b === void 0 ? void 0 : _b.toString())) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not allowed to update this post!');
        }
    }
    const post = yield post_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!post) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Post not found!');
    }
    return post;
});
// Exporting the post services
exports.postServices = {
    insertPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
};
