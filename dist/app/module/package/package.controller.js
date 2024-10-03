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
exports.packageController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const package_service_1 = require("./package.service");
// Insert a new package
const insertPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const packageData = yield package_service_1.packageServices.insertPackage(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Package inserted successfully!',
        data: packageData,
    });
}));
// Get all packages
const getAllPackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield package_service_1.packageServices.getAllPackages(req.query); // Change to getAllTravelers
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Packages retrieved successfully!', // Update message
        data,
        meta: { total, page, totalPage, limit },
    });
}));
// Get a single package by ID
const getPackageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const packageData = yield package_service_1.packageServices.getPackageById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!packageData) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Package retrieved successfully!',
        data: packageData,
    });
}));
// Update a single package by ID
const updatePackageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const packageData = yield package_service_1.packageServices.updatePackageById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.body);
    if (!packageData) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Package updated successfully!',
        data: packageData,
    });
}));
// Delete a single package by ID
const deletePackageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const packageData = yield package_service_1.packageServices.deletePackageById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!packageData) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Package deleted successfully!',
        data: packageData,
    });
}));
exports.packageController = {
    insertPackage,
    getAllPackages,
    getPackageById,
    updatePackageById,
    deletePackageById,
};
