"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../module/auth/auth.route");
const admin_route_1 = require("../module/admin/admin.route");
const patient_route_1 = require("../module/traveller/patient.route");
const user_route_1 = require("../module/user/user.route");
const router = (0, express_1.Router)();
const routes = [
    {
        path: '/auth',
        route: auth_route_1.authRouter,
    },
    {
        path: '/user',
        route: user_route_1.userRouter,
    },
    {
        path: '/patient',
        route: patient_route_1.patientRouter,
    },
    {
        path: '/admin',
        route: admin_route_1.adminRouter,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
