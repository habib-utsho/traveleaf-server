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
exports.packageServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const package_model_1 = __importDefault(require("./package.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const package_constant_1 = require("./package.constant");
const insertPackage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedPayload = Object.assign({}, payload);
    if ((payload === null || payload === void 0 ? void 0 : payload.name) === 'Basic') {
        updatedPayload = Object.assign(Object.assign({}, payload), { price: 500, durationInMonths: 1 });
    }
    else if ((payload === null || payload === void 0 ? void 0 : payload.name) === 'Standard') {
        updatedPayload = Object.assign(Object.assign({}, payload), { price: 1000, durationInMonths: 3 });
    }
    else if ((payload === null || payload === void 0 ? void 0 : payload.name) === 'Premium') {
        updatedPayload = Object.assign(Object.assign({}, payload), { price: 1500, durationInMonths: 6 });
    }
    const packageData = yield package_model_1.default.create(updatedPayload);
    return packageData;
});
const getAllPackages = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const packageQuery = new QueryBuilder_1.default(package_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort}` }))
        .searchQuery(package_constant_1.packageSearchableFields)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery();
    const result = yield (packageQuery === null || packageQuery === void 0 ? void 0 : packageQuery.queryModel);
    const total = yield package_model_1.default.countDocuments(packageQuery.queryModel.getFilter());
    return { data: result, total };
});
const getPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const packageData = yield package_model_1.default.findById(id).select('-__v');
    if (!packageData) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    return packageData;
});
const updatePackageById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const packageData = yield package_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!packageData) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    return packageData;
});
const deletePackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const packageData = yield package_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!packageData) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    return packageData;
});
exports.packageServices = {
    insertPackage,
    getAllPackages,
    getPackageById,
    updatePackageById,
    deletePackageById,
};
