import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import { subscriptionServices } from './subscription.service'

const insertSubscription: RequestHandler = catchAsync(async (req, res) => {
  const subscription = await subscriptionServices.insertSubscription(req.body)
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Subscription created successfully!',
    data: subscription,
  })
})

const getAllSubscriptions: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await subscriptionServices.getAllSubscriptions(
    req.query,
  )

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Subscription retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getSubscriptionById: RequestHandler = catchAsync(async (req, res) => {
  const subscription = await subscriptionServices.getSubscriptionById(
    req.params.id,
  )
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Subscription retrieved successfully!',
    data: subscription,
  })
})

const deleteSubscriptionById: RequestHandler = catchAsync(async (req, res) => {
  const subscription = await subscriptionServices.deleteSubscriptionById(
    req.params.id,
  )
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Subscription deleted successfully!',
    data: subscription,
  })
})

export const subscriptionController = {
  insertSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscriptionById,
}
