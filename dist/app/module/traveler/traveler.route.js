"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelerRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const traveler_controller_1 = require("./traveler.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const traveler_validation_1 = require("./traveler.validation");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.travelerRouter = router;
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), traveler_controller_1.travelerController.getAllTravelers);
router.get('/:id', traveler_controller_1.travelerController.getTravelerById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(traveler_validation_1.updateTravelerZodSchema), traveler_controller_1.travelerController.updateTravelerById);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), traveler_controller_1.travelerController.deleteTravelerById);
router.patch('/follow-traveler/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), traveler_controller_1.travelerController.followTravelerById);
router.patch('/unfollow-traveler/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.TRAVELER), traveler_controller_1.travelerController.unfollowTravelerById);
