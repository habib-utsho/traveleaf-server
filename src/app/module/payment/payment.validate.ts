import { z } from 'zod'

const initPaymentZodSchema = z.object({
  tran_id: z.string(),
  amount: z.string(),
  cus_name: z.string(),
  cus_email: z.string().email(),
  cus_add1: z.string(),
  cus_add2: z.string().optional(), // Optional if it can be omitted
  cus_phone: z.string(),
})
export const paymentZodSchema = {
  initPaymentZodSchema,
}
