import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'
import { packageServices } from './package.service'

// Insert a new package
const insertPackage: RequestHandler = catchAsync(async (req, res) => {
  const packageData = await packageServices.insertPackage(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Package inserted successfully!',
    data: packageData,
  })
})

// Get all packages
const getAllPackages: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await packageServices.getAllPackages(req.query) // Change to getAllTravelers

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Packages retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

// Get a single package by ID
const getPackageById: RequestHandler = catchAsync(async (req, res) => {
  const packageData = await packageServices.getPackageById(req.params?.id)
  if (!packageData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Package retrieved successfully!',
    data: packageData,
  })
})

// Update a single package by ID
const updatePackageById: RequestHandler = catchAsync(async (req, res) => {
  const packageData = await packageServices.updatePackageById(
    req.params?.id,
    req.body,
  )
  if (!packageData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Package updated successfully!',
    data: packageData,
  })
})

// Delete a single package by ID
const deletePackageById: RequestHandler = catchAsync(async (req, res) => {
  const packageData = await packageServices.deletePackageById(req.params?.id)
  if (!packageData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Package deleted successfully!',
    data: packageData,
  })
})

export const packageController = {
  insertPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
}
