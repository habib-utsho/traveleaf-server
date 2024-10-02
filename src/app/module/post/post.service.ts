import { StatusCodes } from 'http-status-codes'
import { TPost } from './post.interface' // Ensure this imports the correct TPost type
import Post from './post.model' // Ensure this imports the correct Post model
import AppError from '../../errors/appError'
import QueryBuilder from '../../builder/QueryBuilder'
import { postSearchableField } from './post.constant'
import User from '../user/user.model'
import Traveler from '../traveler/traveler.model'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import { JwtPayload } from 'jsonwebtoken'

// Function to insert a new post
const insertPost = async (file: any, user: JwtPayload, payload: TPost) => {
  // const author = req.usr

  const existAuthorUser = await User.findById(user?._id)
  const existAuthorTraveler = await Traveler.findOne({ user: user?._id })
  if (!existAuthorUser || !existAuthorTraveler) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Author not found!')
  }
  // const existUser = await User.findById(existAuthor.user)

  const isAlreadyExistUpvote = await Post.findOne({
    author: existAuthorTraveler._id,
    upvotes: { $gt: 0 },
  })

  if (
    payload.isPremium === true &&
    (!isAlreadyExistUpvote || existAuthorUser?.status !== 'premium')
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User must be premium and have at least one upvote to create a premium post!',
    )
  }

  // file upload
  if (file?.path) {
    const cloudinaryRes = await uploadImgToCloudinary(
      `traveleaf-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes?.secure_url) {
      payload.banner = cloudinaryRes.secure_url
    }
  }

  const post = await Post.create({
    ...payload,
    author: existAuthorTraveler._id,
  })
  return post
}

const getAllPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .searchQuery(postSearchableField)
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'author', select: '-createdAt -updatedAt -__v' },
      { path: 'category', select: '-createdAt -updatedAt -__v' },
      { path: 'upvotedBy', select: '-createdAt -updatedAt -__v' },
      { path: 'downvotedBy', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await postQuery?.queryModel
  const total = await Post.countDocuments(postQuery.queryModel.getFilter())
  return { data: result, total }
}

// Function to get a post by ID
const getPostById = async (id: string) => {
  const post = await Post.findById(id).select('-__v')
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found!')
  }
  return post
}

// Function to update a post by ID
const updatePostById = async (
  id: string,
  file: any,
  payload: Partial<TPost>,
) => {
  // file upload
  if (file?.path) {
    const cloudinaryRes = await uploadImgToCloudinary(
      `traveleaf-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes?.secure_url) {
      payload.banner = cloudinaryRes.secure_url
    }
  }

  const post = await Post.findByIdAndUpdate(id, payload, { new: true })
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found!')
  }
  return post
}

// Function to delete a post by ID
const deletePostById = async (id: string) => {
  const post = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found!')
  }
  return post
}

// Exporting the post services
export const postServices = {
  insertPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
}
