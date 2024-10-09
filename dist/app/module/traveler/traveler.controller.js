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
exports.travelerController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const traveler_service_1 = require("./traveler.service"); // Change to travelerServices
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const getAllTravelers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield traveler_service_1.travelerServices.getAllTravelers(req.query); // Change to getAllTravelers
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Travelers are retrieved successfully!', // Update message
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getTravelerById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const traveler = yield traveler_service_1.travelerServices.getTravelerById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id); // Change to getTravelerById
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Traveler is retrieved successfully!', // Update message
        data: traveler,
    });
}));
const updateTravelerById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currUser = req.user;
    const traveler = yield traveler_service_1.travelerServices.updateTravelerById(
    // Change to travelerServices.updateTravelerById
    (_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.file, currUser, req.body);
    if (!traveler) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Traveler not updated!'); // Update message
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Traveler updated successfully!', // Update message
        data: traveler,
    });
}));
const deleteTravelerById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const traveler = yield traveler_service_1.travelerServices.deleteTravelerById(req.params.id); // Change to deleteTravelerById
    if (!traveler) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Traveler not found!'); // Update message
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Traveler is deleted successfully!', // Update message
        data: traveler,
    });
}));
const followTravelerById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currUser = req.user;
    const traveler = yield traveler_service_1.travelerServices.followTraveler(req.params.id, currUser);
    if (!traveler) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The traveler you are trying to follow does not exist.');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'You have successfully followed the traveler.', // Updated success message
        data: traveler,
    });
}));
const unfollowTravelerById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currUser = req.user;
    const traveler = yield traveler_service_1.travelerServices.unfollowTraveler(req.params.id, currUser);
    if (!traveler) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The traveler you are trying to unfollow does not exist.');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'You have successfully unfollowed the traveler.', // Updated success message
        data: traveler,
    });
}));
exports.travelerController = {
    // Change export name to travelerController
    getAllTravelers, // Change to getAllTravelers
    getTravelerById, // Change to getTravelerById
    updateTravelerById, // Change to updateTravelerById
    deleteTravelerById, // Change to deleteTravelerById
    followTravelerById,
    unfollowTravelerById,
};
