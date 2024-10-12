import { StatusCodes } from 'http-status-codes'
import { TComment } from './comment.interface'
import Comment from './comment.model'
import AppError from '../../errors/appError'
import QueryBuilder from '../../builder/QueryBuilder'
import Traveler from '../traveler/traveler.model'

const insertComment = async (payload: TComment) => {
  const isExistUser = await Traveler.findById(payload.user)
  if(!isExistUser){
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  } 
  const comment = await Comment.create(payload)

  return comment
}

const getAllComments = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find(), {
    ...query,
    sort: `${query.sort} -createdAt`,
  })
    .searchQuery([])
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'post', select: '-createdAt -updatedAt -__v' },
      { path: 'user', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await commentQuery?.queryModel
  const total = await Comment.countDocuments(
    commentQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getCommentById = async (id: string) => {
  const comment = await Comment.findById(id).select('-__v')
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found!')
  }
  return comment
}

const updateCommentById = async (id: string, payload: Partial<TComment>) => {
  const comment = await Comment.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found!')
  }
  return comment
}
const deleteCommentById = async (id: string) => {
  const comment = await Comment.findByIdAndDelete(id)
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found!')
  }
  return comment
}

export const commentServices = {
  insertComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
}
