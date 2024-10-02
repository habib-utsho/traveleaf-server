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
  const comments = await commentServices.getAllComments(req.query)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Comments retrieved successfully!',
    data: comments,
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
