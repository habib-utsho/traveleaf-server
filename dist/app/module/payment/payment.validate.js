"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentZodSchema = void 0;
const zod_1 = require("zod");
const initPaymentZodSchema = zod_1.z.object({
    tran_id: zod_1.z.string(),
    amount: zod_1.z.string(),
    cus_name: zod_1.z.string(),
    cus_email: zod_1.z.string().email(),
    cus_add1: zod_1.z.string(),
    cus_add2: zod_1.z.string().optional(), // Optional if it can be omitted
    cus_phone: zod_1.z.string(),
});
exports.paymentZodSchema = {
    initPaymentZodSchema,
};
