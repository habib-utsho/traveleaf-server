import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { statsService } from './stats.service'
import AppError from '../../errors/appError'

const getAdminStats = catchAsync(async (req, res) => {
  const data = await statsService.getAdminStats()

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin stats are retrieved successfully!',
    data,
  })
})
const getUserStats = catchAsync(async (req, res) => {
  const existUser = req?.user

  if (!existUser) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to view this page',
    )
  }
  const data = await statsService.getUserStats(existUser)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'User stats are retrieved successfully!',
    data,
  })
})

export const statsControllers = {
  getAdminStats,
  getUserStats,
}
