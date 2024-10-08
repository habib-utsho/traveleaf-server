"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../module/auth/auth.route");
const admin_route_1 = require("../module/admin/admin.route");
const traveler_route_1 = require("../module/traveler/traveler.route");
const user_route_1 = require("../module/user/user.route");
const category_route_1 = require("../module/category/category.route");
const comment_route_1 = require("../module/comment/comment.route");
const package_route_1 = require("../module/package/package.route");
const subscription_route_1 = require("../module/subscription/subscription.route");
const post_route_1 = require("../module/post/post.route");
const stats_route_1 = require("../module/stats/stats.route");
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
        path: '/traveler',
        route: traveler_route_1.travelerRouter,
    },
    {
        path: '/admin',
        route: admin_route_1.adminRouter,
    },
    {
        path: '/category',
        route: category_route_1.categoryRouter,
    },
    {
        path: '/comment',
        route: comment_route_1.commentRouter,
    },
    {
        path: '/package',
        route: package_route_1.packageRouter,
    },
    {
        path: '/subscription',
        route: subscription_route_1.subscriptionRouter,
    },
    {
        path: '/post',
        route: post_route_1.postRouter,
    },
    {
        path: '/stats',
        route: stats_route_1.statsRouter,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
