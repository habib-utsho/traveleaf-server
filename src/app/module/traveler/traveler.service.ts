import { JwtPayload } from 'jsonwebtoken'
import QueryBuilder from '../../builder/QueryBuilder'
import { travelerSearchableFields } from './traveler.constant'
import { TTraveler } from './traveler.interface'
import Traveler from './traveler.model' // Import Traveler model
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'

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
    ])

  const result = await travelerQuery?.queryModel
  const total = await Traveler.countDocuments(
    travelerQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getTravelerById = async (id: string) => {
  const traveler = await Traveler.findById(id)
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v')
  return traveler
}

const updateTravelerById = async (
  id: string,
  currUser: JwtPayload,
  payload: Partial<TTraveler>,
) => {
  const existTraveler = await Traveler.findOne({ user: currUser?._id })
  const updateTraveler = await Traveler.findById(id)

  if (!existTraveler) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Traveler not found!')
  }

  if (updateTraveler?._id !== existTraveler?._id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not allowed to update this post!',
    )
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

export const travelerServices = {
  // Change export name to travelerServices
  getAllTravelers, // Change to getAllTravelers
  getTravelerById, // Change to getTravelerById
  updateTravelerById, // Change to updateTravelerById
  deleteTravelerById, // Change to deleteTravelerById
}
