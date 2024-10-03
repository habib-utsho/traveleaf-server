import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'
import { categoryServices } from './category.service'

// Insert a new category
const insertCategory: RequestHandler = catchAsync(async (req, res) => {
  const category = await categoryServices.insertCategory(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Category inserted successfully!',
    data: category,
  })
})

// Get all categories
const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await categoryServices.getAllCategories(req.query) // Change to getAllTravelers

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Categories are retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

// Get a single category by ID
const getCategoryById: RequestHandler = catchAsync(async (req, res) => {
  const category = await categoryServices.getCategoryById(req.params?.id)
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Category retrieved successfully!',
    data: category,
  })
})
// Get a single category by ID
const updateCategoryById: RequestHandler = catchAsync(async (req, res) => {
  const category = await categoryServices.updateCategoryById(
    req.params?.id,
    req.body,
  )
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Category updated successfully!',
    data: category,
  })
})
// Get a single category by ID
const deleteCategoryById: RequestHandler = catchAsync(async (req, res) => {
  const category = await categoryServices.deleteCategoryById(req.params?.id)
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Category deleted successfully!',
    data: category,
  })
})

export const categoryController = {
  insertCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
}
