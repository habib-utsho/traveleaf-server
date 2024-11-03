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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const axios_1 = __importDefault(require("axios"));
const initPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentInfo = Object.assign({ store_id: 'aamarpaytest', success_url: 'https://car-cleanify.netlify.app/success', fail_url: 'https://car-cleanify.netlify.app/failed', cancel_url: 'https://car-cleanify.netlify.app/cancelled', currency: 'BDT', signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183', desc: 'Merchant Registration Payment', cus_city: 'Dhaka', cus_state: 'Dhaka', cus_postcode: '1206', cus_country: 'Bangladesh', type: 'json' }, payload);
        const res = yield axios_1.default.post('https://sandbox.aamarpay.com/jsonpost.php', paymentInfo);
        if (res.data && res.data.result) {
            return res.data;
        }
        else {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payment failed');
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'An error occurred during the payment process');
    }
});
exports.paymentServices = {
    initPayment,
};
