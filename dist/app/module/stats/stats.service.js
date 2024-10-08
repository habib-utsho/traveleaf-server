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
exports.statsService = void 0;
const category_model_1 = __importDefault(require("../category/category.model"));
const package_model_1 = __importDefault(require("../package/package.model"));
const post_model_1 = __importDefault(require("../post/post.model"));
const subscription_model_1 = __importDefault(require("../subscription/subscription.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const traveler_model_1 = __importDefault(require("../traveler/traveler.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield user_model_1.default.countDocuments();
    const totalPost = yield post_model_1.default.countDocuments();
    const totalPackage = yield package_model_1.default.countDocuments();
    const totalCategory = yield category_model_1.default.countDocuments();
    const totalSubscription = yield subscription_model_1.default.countDocuments();
    // const availableSlots = await Subscription.find({
    //   isBooked: 'available',
    // }).countDocuments()
    return {
        totalUsers,
        totalPost,
        totalPackage,
        totalCategory,
        totalSubscription,
    };
});
const getUserStats = (existUser) => __awaiter(void 0, void 0, void 0, function* () {
    const traveler = yield traveler_model_1.default.findOne({ user: existUser === null || existUser === void 0 ? void 0 : existUser.id });
    if ((traveler === null || traveler === void 0 ? void 0 : traveler.user) != (existUser === null || existUser === void 0 ? void 0 : existUser.id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to view this page');
    }
    const totalSubscription = yield subscription_model_1.default.find({}).countDocuments();
    const totalPost = yield post_model_1.default.find({ author: traveler === null || traveler === void 0 ? void 0 : traveler._id }).countDocuments();
    const totalPremiumPost = yield post_model_1.default.find({
        author: traveler === null || traveler === void 0 ? void 0 : traveler._id,
        isPremium: true,
    }).countDocuments();
    return {
        totalSubscription,
        totalPost,
        totalPremiumPost,
    };
});
exports.statsService = {
    getAdminStats,
    getUserStats,
};
