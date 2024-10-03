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
exports.categoryController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const category_service_1 = require("./category.service");
// Insert a new category
const insertCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_service_1.categoryServices.insertCategory(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Category inserted successfully!',
        data: category,
    });
}));
// Get all categories
const getAllCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield category_service_1.categoryServices.getAllCategories(req.query); // Change to getAllTravelers
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Categories are retrieved successfully!', // Update message
        data,
        meta: { total, page, totalPage, limit },
    });
}));
// Get a single category by ID
const getCategoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const category = yield category_service_1.categoryServices.getCategoryById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!category) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Category retrieved successfully!',
        data: category,
    });
}));
// Get a single category by ID
const updateCategoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const category = yield category_service_1.categoryServices.updateCategoryById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.body);
    if (!category) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Category updated successfully!',
        data: category,
    });
}));
// Get a single category by ID
const deleteCategoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const category = yield category_service_1.categoryServices.deleteCategoryById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!category) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Category deleted successfully!',
        data: category,
    });
}));
exports.categoryController = {
    insertCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
};
