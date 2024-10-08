"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const stats_controller_1 = require("./stats.controller");
const router = (0, express_1.Router)();
exports.statsRouter = router;
router.get('/admin', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), stats_controller_1.statsControllers.getAdminStats);
router.get('/user', (0, auth_1.default)(user_constant_1.USER_ROLE.TRAVELER), stats_controller_1.statsControllers.getUserStats);
