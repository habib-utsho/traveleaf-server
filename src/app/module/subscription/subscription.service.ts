import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import { TSubscription } from './subscription.interface'
import Subscription from './subscription.model'
import QueryBuilder from '../../builder/QueryBuilder'
import Package from '../package/package.model'
import moment from 'moment'
import Traveler from '../traveler/traveler.model'
import axios from 'axios'
import Post from '../post/post.model'
import User from '../user/user.model'

const insertSubscription = async (payload: TSubscription) => {
  try {

    const existPackage = await Package.findById(payload.package)
    const existTraveler = await Traveler.findById(payload.user)
    const existUser = await User.findById(existTraveler?.user)
    if (!existPackage) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
    }
    if (!existTraveler || !existUser) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    const existUserPostsWithUpvoted = await Post.findOne({author: payload.user,   upvotedBy: { $exists: true, $ne: [] }})
    if(!existUserPostsWithUpvoted){
      throw new AppError(StatusCodes.BAD_REQUEST, 'User must have at least one upvoted post to subscribe!')
    }
    const months = existPackage?.durationInMonths
    const startDate = payload.startDate || new Date()
    const endDate = moment(startDate).add(months, 'months').toDate()
    const subscription = await Subscription.create({
      ...payload,
      startDate,
      endDate,
    })
    
    existTraveler.status = 'premium'
    existUser.status = 'premium'

    await existTraveler.save()
    await existUser.save()

    const paymentInfo = {
      store_id: 'aamarpaytest',
      tran_id: subscription?._id,
      amount: existPackage?.price,
      cus_name: existTraveler?.name,
      cus_email: existTraveler?.email,
      cus_add1: existTraveler?.district,
      cus_phone: existTraveler?.phone,
      // /package/66fce19de29c39a5a0bf551f/success
      success_url: `https://traveleaf.vercel.app/package/${existPackage._id}/success?subscriptionId=`+subscription?._id,
      fail_url: `https://traveleaf.vercel.app/package/${existPackage._id}/failed`,
      cancel_url: `https://traveleaf.vercel.app/package/${existPackage._id}/cancelled`,
      currency: 'BDT',
      signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
      desc: 'Merchant Registration Payment',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1206',
      cus_country: 'Bangladesh',
      type: 'json',
      ...payload,
    }
    const res = await axios.post(
      'https://sandbox.aamarpay.com/jsonpost.php',
      paymentInfo,
    )
    if (res.data && res.data.result) {
      const paymentRes = res.data
      return {payment_url: paymentRes?.payment_url, package: existPackage}
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Payment failed')
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'An error occurred during the payment process',
    )
  }
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
