import { Router } from 'express'
import { paymentControllers } from './payment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { paymentZodSchema } from './payment.validate'

const router = Router()

router.post(
  '/init',
  zodValidateHandler(paymentZodSchema.initPaymentZodSchema),
  paymentControllers.initPayment,
)

export { router as paymentRouter }
