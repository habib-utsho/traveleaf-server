import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { travelerServices } from './traveler.service' // Change to travelerServices
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'

const getAllTravelers: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await travelerServices.getAllTravelers(req.query) // Change to getAllTravelers

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Travelers are retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getTravelerById: RequestHandler = catchAsync(async (req, res) => {
  const traveler = await travelerServices.getTravelerById(req.params?.id) // Change to getTravelerById
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Traveler is retrieved successfully!', // Update message
    data: traveler,
  })
})

// const updateTravelerById: RequestHandler = catchAsync(async (req, res) => {
//   const traveler = await travelerServices.updateTravelerById( // Change to travelerServices.updateTravelerById
//     req.params?.id,
//     req.body,
//   )
//   if (!traveler) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Traveler not updated!') // Update message
//   }
//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: 'Traveler updated successfully!', // Update message
//     data: traveler,
//   })
// })

const deleteTravelerById = catchAsync(async (req, res) => {
  const traveler = await travelerServices.deleteTravelerById(req.params.id) // Change to deleteTravelerById
  if (!traveler) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Traveler not found!') // Update message
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Traveler is deleted successfully!', // Update message
    data: traveler,
  })
})

export const travelerController = {
  // Change export name to travelerController
  getAllTravelers, // Change to getAllTravelers
  getTravelerById, // Change to getTravelerById
  // updateTravelerById, // Change to updateTravelerById
  deleteTravelerById, // Change to deleteTravelerById
}