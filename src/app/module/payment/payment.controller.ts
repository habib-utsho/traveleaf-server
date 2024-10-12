import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { paymentServices } from './payment.service'

const initPayment = catchAsync(async (req, res) => {
  const data = await paymentServices.initPayment(req.body)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Redirected to the payment page!',
    data: data,
  })
})

export const paymentControllers = {
  initPayment,
}
