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
exports.userServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("./user.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const traveler_model_1 = __importDefault(require("../traveler/traveler.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const sendEmail_1 = require("../../utils/sendEmail");
const insertTraveler = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const alreadyExistEmail = yield traveler_model_1.default.findOne({ email: payload.email });
        if (alreadyExistEmail) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already exist. Try with different email!');
        }
        // file upload
        if (file === null || file === void 0 ? void 0 : file.path) {
            const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
            if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
                payload.profileImg = cloudinaryRes.secure_url;
            }
        }
        const userData = {
            email: payload.email,
            password: payload.password,
            needsPasswordChange: false,
            role: 'traveler',
        };
        // Save user
        const user = yield user_model_1.default.create([userData], { session });
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert user to db');
        }
        const travelerData = Object.assign(Object.assign({}, payload), { user: user[0]._id });
        // Save patient
        const traveler = yield traveler_model_1.default.create([travelerData], { session });
        if (!(traveler === null || traveler === void 0 ? void 0 : traveler.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert traveler!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        yield (0, sendEmail_1.sendEmail)({
            toEmail: payload === null || payload === void 0 ? void 0 : payload.email,
            subject: 'Your account is created!',
            text: `Hello, ${payload === null || payload === void 0 ? void 0 : payload.name} Welcome to our platform! Your account has been successfully created. You can log in using the following credentials:
    
      Email: ${payload === null || payload === void 0 ? void 0 : payload.email}
      Password: ${payload.password}
    
      Please keep this information secure. You can log in here: ${process.env.CLIENT_URL}/signin`,
            html: `
        <p>Welcome to our platform!</p>
        <p>Your account has been successfully created.</p>
    
        <p>You can log in using the following credentials:</p>
        
        <p><strong>Email:</strong> ${payload === null || payload === void 0 ? void 0 : payload.email}</p>
        <p><strong>Password:</strong> ${payload.password || process.env.ADMIN_DEFAULT_PASSWORD}</p>
    
        <div>
          <a href="${process.env.CLIENT_URL}/signin" style="background-color: #00ABE4; margin: 5px 0; cursor: pointer; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; display: inline-block;">Log in</a>
        </div>
    
      `,
        });
        return traveler[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const insertAdmin = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const alreadyExistEmail = yield admin_model_1.default.findOne({ email: payload.email });
        const alreadyExistPhone = yield admin_model_1.default.findOne({ phone: payload.phone });
        if (alreadyExistEmail) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already exist. Try with different email!');
        }
        if (alreadyExistPhone) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Phone is already exist. Try with different phone!');
        }
        // file upload
        if (file === null || file === void 0 ? void 0 : file.path) {
            const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
            if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
                payload.profileImg = cloudinaryRes.secure_url;
            }
        }
        const userData = {
            email: payload.email,
            password: payload.password || process.env.ADMIN_DEFAULT_PASSWORD,
            needsPasswordChange: payload.password ? false : true,
            role: 'admin',
        };
        // Save user
        const user = yield user_model_1.default.create([userData], { session });
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert user!');
        }
        const adminData = Object.assign(Object.assign({}, payload), { user: user[0]._id });
        // Save doctor
        const admin = yield admin_model_1.default.create([adminData], { session });
        if (!(admin === null || admin === void 0 ? void 0 : admin.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert admin!');
        }
        yield session.commitTransaction();
        yield (0, sendEmail_1.sendEmail)({
            toEmail: payload === null || payload === void 0 ? void 0 : payload.email,
            subject: 'Your admin account is created!',
            text: `Hello, ${payload === null || payload === void 0 ? void 0 : payload.name} Welcome to our platform! Your admin account has been successfully created. You can log in using the following credentials:
    
      Email: ${payload === null || payload === void 0 ? void 0 : payload.email}
      Password: ${payload.password || process.env.ADMIN_DEFAULT_PASSWORD}
    
      Please keep this information secure. You can log in here: ${process.env.CLIENT_URL}/signin`,
            html: `
        <p>Welcome to our platform!</p>
        <p>Your admin account has been successfully created.</p>
    
        <p>You can log in using the following credentials:</p>
        
        <p><strong>Email:</strong> ${payload === null || payload === void 0 ? void 0 : payload.email}</p>
        <p><strong>Password:</strong> ${payload.password || process.env.ADMIN_DEFAULT_PASSWORD}</p>
    
        <div>
          <a href="${process.env.CLIENT_URL}/signin" style="background-color: #00ABE4; margin: 5px 0; cursor: pointer; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; display: inline-block;">Log in</a>
        </div>
    
        <p>Please keep this information secure and change your password after logging in.</p>
      `,
        });
        return admin[0];
    }
    catch (err) {
        yield session.abortTransaction();
        throw new Error(err);
    }
    finally {
        yield session.endSession();
    }
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({}).select('-__v');
    return users;
});
const getSingleUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id).select('-__v');
    return user;
});
const getMe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (payload.role === 'traveler') {
        result = yield traveler_model_1.default.findOne({ user: payload._id }).select('-__v');
    }
    if (payload.role === 'admin') {
        result = yield admin_model_1.default.findOne({ user: payload._id }).select('-__v');
    }
    return result;
});
exports.userServices = {
    insertTraveler,
    insertAdmin,
    getAllUser,
    getSingleUserById,
    getMe,
};
