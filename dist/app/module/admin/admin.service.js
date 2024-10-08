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
exports.adminServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const admin_constant_1 = require("./admin.constant");
const admin_model_1 = __importDefault(require("./admin.model")); // Import Admin model
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const getAllAdmins = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const adminQuery = new QueryBuilder_1.default(admin_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} isDeleted` }))
        .searchQuery(admin_constant_1.adminSearchableFields) // Use the Admin searchable fields
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }]);
    const result = yield (adminQuery === null || adminQuery === void 0 ? void 0 : adminQuery.queryModel);
    const total = yield admin_model_1.default.countDocuments(adminQuery.queryModel.getFilter());
    return { data: result, total };
});
const getAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.default.findOne({ _id: id }) // Use _id instead of id
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v');
    return admin;
});
const updateAdminById = (id, file, currUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the admin based on the current user
    const existAdmin = yield admin_model_1.default.findOne({ user: currUser === null || currUser === void 0 ? void 0 : currUser._id });
    const updateAdmin = yield admin_model_1.default.findById(id);
    // If the admin does not exist
    if (!existAdmin) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Admin not found!');
    }
    // If the current user is not allowed to update the admin
    if ((updateAdmin === null || updateAdmin === void 0 ? void 0 : updateAdmin._id.toString()) !== (existAdmin === null || existAdmin === void 0 ? void 0 : existAdmin._id.toString())) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not allowed to update this admin!');
    }
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`traveleaf-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            payload.profileImg = cloudinaryRes.secure_url;
        }
    }
    // Update the admin with the provided payload
    const admin = yield admin_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    })
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v -password');
    return admin;
});
const deleteAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return admin;
});
exports.adminServices = {
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
};
