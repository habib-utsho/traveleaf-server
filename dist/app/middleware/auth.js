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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../module/user/user.model"));
const jwtVerify_1 = __importDefault(require("../utils/jwtVerify"));
const admin_model_1 = __importDefault(require("../module/admin/admin.model"));
const traveler_model_1 = __importDefault(require("../module/traveler/traveler.model"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = req.headers.authorization;
        if (!token) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        const bearerToken = (_a = token.split(' ')) === null || _a === void 0 ? void 0 : _a[1];
        if (!bearerToken) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        // let decoded
        // try {
        //   decoded = jwt.verify(
        //     bearerToken,
        //     process.env.JWT_ACCESS_SECRET as string,
        //   ) as JwtPayload
        // } catch (e) {
        //   throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
        // }
        const decoded = (yield (0, jwtVerify_1.default)(bearerToken, process.env.JWT_ACCESS_SECRET));
        const { _id, role } = decoded;
        const user = yield user_model_1.default.findById(_id);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'This user is not found!');
        }
        // checking if the user is blocked or not
        const isBlocked = user === null || user === void 0 ? void 0 : user.isBlocked;
        if (isBlocked) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is blocked!');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        let updatedDecoded;
        if (decoded.role === 'admin') {
            const admin = yield admin_model_1.default.findOne({ user: _id });
            updatedDecoded = Object.assign(Object.assign({}, decoded), { user: admin === null || admin === void 0 ? void 0 : admin._id, profileImg: admin === null || admin === void 0 ? void 0 : admin.profileImg, name: admin === null || admin === void 0 ? void 0 : admin.name, phone: admin === null || admin === void 0 ? void 0 : admin.phone });
        }
        if (decoded.role === 'traveler') {
            const traveler = yield traveler_model_1.default.findOne({ user: _id });
            updatedDecoded = Object.assign(Object.assign({}, decoded), { user: traveler === null || traveler === void 0 ? void 0 : traveler._id, profileImg: traveler === null || traveler === void 0 ? void 0 : traveler.profileImg, name: traveler === null || traveler === void 0 ? void 0 : traveler.name, phone: traveler === null || traveler === void 0 ? void 0 : traveler.phone });
        }
        req.user = updatedDecoded;
        next();
    }));
};
exports.default = auth;
