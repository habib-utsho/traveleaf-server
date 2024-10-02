import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import { TSubscription } from './subscription.interface'
import Subscription from './subscription.model'
import QueryBuilder from '../../builder/QueryBuilder'
import Package from '../package/package.model'
import moment from 'moment'
import Traveler from '../traveler/traveler.model'

const insertSubscription = async (payload: TSubscription) => {
  const existPackage = await Package.findById(payload.package)
  const existUser = await Traveler.findById(payload.user)
  if (!existPackage) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  if (!existUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }
  const months = existPackage?.durationInMonths
  const startDate = payload.startDate || new Date()
  const endDate = moment(startDate).add(months, 'months').toDate()
  const subscription = await Subscription.create({
    ...payload,
    startDate,
    endDate,
  })
  return subscription
}

const getAllSubscriptions = async (query: Record<string, unknown>) => {
  const subscriptionQuery = new QueryBuilder(Subscription.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .searchQuery([])
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'user', select: '-createdAt -updatedAt -__v' },
      { path: 'package', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await subscriptionQuery?.queryModel
  const total = await Subscription.countDocuments(
    subscriptionQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getSubscriptionById = async (id: string) => {
  const subscription = await Subscription.findById(id)
  if (!subscription) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found!')
  }
  return subscription
}

const deleteSubscriptionById = async (id: string) => {
  const subscription = await Subscription.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  )
  if (!subscription) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found!')
  }
  return subscription
}

export const subscriptionServices = {
  insertSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscriptionById,
}
