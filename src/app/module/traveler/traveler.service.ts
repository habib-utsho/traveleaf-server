import { JwtPayload } from 'jsonwebtoken'
import QueryBuilder from '../../builder/QueryBuilder'
import { travelerSearchableFields } from './traveler.constant'
import { TTraveler } from './traveler.interface'
import Traveler from './traveler.model' // Import Traveler model
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import mongoose from 'mongoose'

const getAllTravelers = async (query: Record<string, unknown>) => {
  const travelerQuery = new QueryBuilder(Traveler.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .searchQuery(travelerSearchableFields)
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'user', select: '-createdAt -updatedAt -__v -password' },

      {
        path: 'followers',
        select: 'name profileImg',
      },
      {
        path: 'following',
        select: 'name profileImg',
      },
    ])

  const result = await travelerQuery?.queryModel
  const total = await Traveler.countDocuments(
    travelerQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getTravelerById = async (id: string) => {
  const traveler = await Traveler.findById(id)
    .select('-__v') // Exclude the __v field
    .populate([
      {
        path: 'user', // Path to the field to populate
        select: '-createdAt -updatedAt -__v -password', // Fields to exclude from the populated user document
      },
      {
        path: 'followers', // Path to populate followers
        select: 'name profileImg', // Fields to include from the populated follower documents
      },
      {
        path: 'following', // Path to populate following
        select: 'name profileImg', // Fields to include from the populated following documents
      },
    ])

  return traveler
}

const updateTravelerById = async (
  id: string,
  file: any,
  currUser: JwtPayload,
  payload: Partial<TTraveler>,
) => {
  const existTraveler = await Traveler.findOne({ user: currUser?._id })
  const updateTraveler = await Traveler.findById(id)

  if (!existTraveler) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Traveler not found!')
  }

  if (updateTraveler?._id.toString() !== existTraveler?._id.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not allowed to update this post!',
    )
  }

  // file upload
  if (file?.path) {
    const cloudinaryRes = await uploadImgToCloudinary(
      `traveleaf-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes?.secure_url) {
      payload.profileImg = cloudinaryRes.secure_url
    }
  }

  const traveler = await Traveler.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v -password')

  return traveler
}

const deleteTravelerById = async (id: string) => {
  const traveler = await Traveler.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return traveler
}

const followTraveler = async (travelerId: string, currUser: JwtPayload) => {
  const session = await mongoose.startSession() // Start a session
  session.startTransaction() // Start the transaction

  try {
    const travelerToFollow =
      await Traveler.findById(travelerId).session(session) // Use session in queries
    const currentUserTraveler = await Traveler.findOne({
      user: currUser?._id,
    }).session(session)

    if (!travelerToFollow) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Traveler not found!')
    }

    if (!currentUserTraveler) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Current user not found!')
    }

    if (
      currentUserTraveler._id.toString() === travelerToFollow._id.toString()
    ) {
      throw new AppError(StatusCodes.BAD_REQUEST, "You can't follow yourself!")
    }

    // Check if already following
    if (
      travelerToFollow.followers.includes(currentUserTraveler._id) ||
      currentUserTraveler.following.includes(travelerToFollow._id)
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Already following this traveler',
      )
    }

    // Add current user's ID to the traveler's followers array
    travelerToFollow.followers.push(currentUserTraveler._id)

    // Add target traveler's ID to the current user's following array
    currentUserTraveler.following.push(travelerToFollow._id)

    // Save both travelers with session
    await travelerToFollow.save({ session })
    await currentUserTraveler.save({ session })

    // Commit the transaction
    await session.commitTransaction()
    session.endSession() // End the session

    return currentUserTraveler
  } catch (error) {
    await session.abortTransaction() // Abort the transaction if an error occurs
    session.endSession() // End the session
    throw error // Rethrow the error to handle it higher up
  }
}

const unfollowTraveler = async (travelerId: string, currUser: JwtPayload) => {
  const session = await mongoose.startSession() // Start a session
  session.startTransaction() // Start the transaction

  try {
    const travelerToUnfollow =
      await Traveler.findById(travelerId).session(session)
    const currentUserTraveler = await Traveler.findOne({
      user: currUser?._id,
    }).session(session)

    if (!travelerToUnfollow) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Traveler not found!')
    }

    if (!currentUserTraveler) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Current user not found!')
    }

    if (
      currentUserTraveler._id.toString() === travelerToUnfollow._id.toString()
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "You can't unfollow yourself!",
      )
    }

    // Check if not already following
    if (
      !travelerToUnfollow.followers.includes(currentUserTraveler._id) ||
      !currentUserTraveler.following.includes(travelerToUnfollow._id)
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "You aren't following this traveler",
      )
    }

    // Remove current user's ID from the traveler's followers array
    travelerToUnfollow.followers = travelerToUnfollow.followers.filter(
      (follower) => follower.toString() !== currentUserTraveler._id.toString(),
    )

    // Remove target traveler's ID from the current user's following array
    currentUserTraveler.following = currentUserTraveler.following.filter(
      (following) => following.toString() !== travelerId,
    )

    // Save both travelers with session
    await travelerToUnfollow.save({ session })
    await currentUserTraveler.save({ session })

    // Commit the transaction
    await session.commitTransaction()
    session.endSession() // End the session

    return currentUserTraveler
  } catch (error) {
    await session.abortTransaction() // Abort the transaction if an error occurs
    session.endSession() // End the session
    throw error // Rethrow the error to handle it higher up
  }
}

export const travelerServices = {
  getAllTravelers,
  getTravelerById,
  updateTravelerById,
  deleteTravelerById,
  followTraveler,
  unfollowTraveler,
}
