import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'
import { commentServices } from './comment.service'

// Insert a new comment
const insertComment: RequestHandler = catchAsync(async (req, res) => {
  const comment = await commentServices.insertComment(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Comment inserted successfully!',
    data: comment,
  })
})

// Get all comments
const getAllComments: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await commentServices.getAllComments(req.query) // Change to getAllTravelers

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Comments retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

// Get a single comment by ID
const getCommentById: RequestHandler = catchAsync(async (req, res) => {
  const comment = await commentServices.getCommentById(req.params?.id)
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Comment retrieved successfully!',
    data: comment,
  })
})

// Update a single comment by ID
const updateCommentById: RequestHandler = catchAsync(async (req, res) => {
  const comment = await commentServices.updateCommentById(
    req.params?.id,
    req.body,
  )
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Comment updated successfully!',
    data: comment,
  })
})

// Delete a single comment by ID
const deleteCommentById: RequestHandler = catchAsync(async (req, res) => {
  const comment = await commentServices.deleteCommentById(req.params?.id)
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Comment deleted successfully!',
    data: comment,
  })
})

export const commentController = {
  insertComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
}
