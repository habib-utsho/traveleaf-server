import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'
import { postServices } from './post.service'
import { JwtPayload } from 'jsonwebtoken'

// Insert a new post
const insertPost: RequestHandler = catchAsync(async (req, res) => {
  const author = req.user as JwtPayload
  const post = await postServices.insertPost(req.file, author, req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Post inserted successfully!',
    data: post,
  })
})

// Get all posts
const getAllPosts: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await postServices.getAllPosts(req.query) // Change to getAllTravelers

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Posts retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

// Get a single post by ID
const getPostById: RequestHandler = catchAsync(async (req, res) => {
  const post = await postServices.getPostById(req.params?.id)
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Post retrieved successfully!',
    data: post,
  })
})

// Update a single post by ID
const updatePostById: RequestHandler = catchAsync(async (req, res) => {
  const author = req.user as JwtPayload

  const post = await postServices.updatePostById(
    req.params?.id,
    req.file,
    author,
    req.body,
  )
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Post updated successfully!',
    data: post,
  })
})

// Delete a single post by ID
const deletePostById: RequestHandler = catchAsync(async (req, res) => {
  const author = req.user as JwtPayload

  const post = await postServices.deletePostById(req.params?.id, author)
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Post deleted successfully!',
    data: post,
  })
})

export const postController = {
  insertPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
}
