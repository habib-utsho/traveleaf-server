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
exports.travelerServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const traveler_constant_1 = require("./traveler.constant");
const traveler_model_1 = __importDefault(require("./traveler.model")); // Import Traveler model
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const getAllTravelers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const travelerQuery = new QueryBuilder_1.default(traveler_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort}` }))
        .searchQuery(traveler_constant_1.travelerSearchableFields)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'user', select: '-createdAt -updatedAt -__v -password' },
    ]);
    const result = yield (travelerQuery === null || travelerQuery === void 0 ? void 0 : travelerQuery.queryModel);
    const total = yield traveler_model_1.default.countDocuments(travelerQuery.queryModel.getFilter());
    return { data: result, total };
});
const getTravelerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const traveler = yield traveler_model_1.default.findById(id)
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v');
    return traveler;
});
const updateTravelerById = (id, file, currUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existTraveler = yield traveler_model_1.default.findOne({ user: currUser === null || currUser === void 0 ? void 0 : currUser._id });
    const updateTraveler = yield traveler_model_1.default.findById(id);
    if (!existTraveler) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Traveler not found!');
    }
    if ((updateTraveler === null || updateTraveler === void 0 ? void 0 : updateTraveler._id.toString()) !== (existTraveler === null || existTraveler === void 0 ? void 0 : existTraveler._id.toString())) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not allowed to update this post!');
    }
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`traveleaf-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            payload.profileImg = cloudinaryRes.secure_url;
        }
    }
    const traveler = yield traveler_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    })
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v -password');
    return traveler;
});
const deleteTravelerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const traveler = yield traveler_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return traveler;
});
exports.travelerServices = {
    // Change export name to travelerServices
    getAllTravelers, // Change to getAllTravelers
    getTravelerById, // Change to getTravelerById
    updateTravelerById, // Change to updateTravelerById
    deleteTravelerById, // Change to deleteTravelerById
};
