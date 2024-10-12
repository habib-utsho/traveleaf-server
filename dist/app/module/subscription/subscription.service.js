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
const axios_1 = __importDefault(require("axios"));
const post_model_1 = __importDefault(require("../post/post.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const insertSubscription = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existPackage = yield package_model_1.default.findById(payload.package);
        const existTraveler = yield traveler_model_1.default.findById(payload.user);
        const existUser = yield user_model_1.default.findById(existTraveler === null || existTraveler === void 0 ? void 0 : existTraveler.user);
        if (!existPackage) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found!');
        }
        if (!existTraveler || !existUser) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
        }
        const existUserPostsWithUpvoted = yield post_model_1.default.findOne({ author: payload.user, upvotedBy: { $exists: true, $ne: [] } });
        if (!existUserPostsWithUpvoted) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User must have at least one upvoted post to subscribe!');
        }
        const months = existPackage === null || existPackage === void 0 ? void 0 : existPackage.durationInMonths;
        const startDate = payload.startDate || new Date();
        const endDate = (0, moment_1.default)(startDate).add(months, 'months').toDate();
        const subscription = yield subscription_model_1.default.create(Object.assign(Object.assign({}, payload), { startDate,
            endDate }));
        existTraveler.status = 'premium';
        existUser.status = 'premium';
        yield existTraveler.save();
        yield existUser.save();
        const paymentInfo = Object.assign({ store_id: 'aamarpaytest', tran_id: subscription === null || subscription === void 0 ? void 0 : subscription._id, amount: existPackage === null || existPackage === void 0 ? void 0 : existPackage.price, cus_name: existTraveler === null || existTraveler === void 0 ? void 0 : existTraveler.name, cus_email: existTraveler === null || existTraveler === void 0 ? void 0 : existTraveler.email, cus_add1: existTraveler === null || existTraveler === void 0 ? void 0 : existTraveler.district, cus_phone: existTraveler === null || existTraveler === void 0 ? void 0 : existTraveler.phone, 
            // /package/66fce19de29c39a5a0bf551f/success
            success_url: `https://traveleaf.vercel.app/package/${existPackage._id}/success?subscriptionId=` + (subscription === null || subscription === void 0 ? void 0 : subscription._id), fail_url: `https://traveleaf.vercel.app/package/${existPackage._id}/failed`, cancel_url: `https://traveleaf.vercel.app/package/${existPackage._id}/cancelled`, currency: 'BDT', signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183', desc: 'Merchant Registration Payment', cus_city: 'Dhaka', cus_state: 'Dhaka', cus_postcode: '1206', cus_country: 'Bangladesh', type: 'json' }, payload);
        const res = yield axios_1.default.post('https://sandbox.aamarpay.com/jsonpost.php', paymentInfo);
        if (res.data && res.data.result) {
            const paymentRes = res.data;
            return { payment_url: paymentRes === null || paymentRes === void 0 ? void 0 : paymentRes.payment_url, package: existPackage };
        }
        else {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payment failed');
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'An error occurred during the payment process');
    }
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
