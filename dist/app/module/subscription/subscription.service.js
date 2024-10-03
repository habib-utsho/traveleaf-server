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
exports.subscriptionServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const subscription_model_1 = __importDefault(require("./subscription.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const package_model_1 = __importDefault(require("../package/package.model"));
const moment_1 = __importDefault(require("moment"));
const traveler_model_1 = __importDefault(require("../traveler/traveler.model"));
const insertSubscription = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existPackage = yield package_model_1.default.findById(payload.package);
    const existUser = yield traveler_model_1.default.findById(payload.user);
    if (!existPackage) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
    }
    if (!existUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    const months = existPackage === null || existPackage === void 0 ? void 0 : existPackage.durationInMonths;
    const startDate = payload.startDate || new Date();
    const endDate = (0, moment_1.default)(startDate).add(months, 'months').toDate();
    const subscription = yield subscription_model_1.default.create(Object.assign(Object.assign({}, payload), { startDate,
        endDate }));
    return subscription;
});
const getAllSubscriptions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionQuery = new QueryBuilder_1.default(subscription_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort}` }))
        .searchQuery([])
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'user', select: '-createdAt -updatedAt -__v' },
        { path: 'package', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield (subscriptionQuery === null || subscriptionQuery === void 0 ? void 0 : subscriptionQuery.queryModel);
    const total = yield subscription_model_1.default.countDocuments(subscriptionQuery.queryModel.getFilter());
    return { data: result, total };
});
const getSubscriptionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.default.findById(id);
    if (!subscription) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found!');
    }
    return subscription;
});
const deleteSubscriptionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.default.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!subscription) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found!');
    }
    return subscription;
});
exports.subscriptionServices = {
    insertSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    deleteSubscriptionById,
};
