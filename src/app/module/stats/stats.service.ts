import { JwtPayload } from 'jsonwebtoken'
import Category from '../category/category.model'
import Package from '../package/package.model'
import Post from '../post/post.model'
import Subscription from '../subscription/subscription.model'
import User from '../user/user.model'
import Traveler from '../traveler/traveler.model'
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'

const getAdminStats = async () => {
  const totalUsers = await User.countDocuments()
  const totalPost = await Post.countDocuments()
  const totalPackage = await Package.countDocuments()
  const totalCategory = await Category.countDocuments()
  const totalSubscription = await Subscription.countDocuments()
  // const availableSlots = await Subscription.find({
  //   isBooked: 'available',
  // }).countDocuments()

  return {
    totalUsers,
    totalPost,
    totalPackage,
    totalCategory,
    totalSubscription,
  }
}
const getUserStats = async (existUser: JwtPayload) => {
  const traveler = await Traveler.findOne({ user: existUser?._id })

  if (traveler?.user != existUser?._id) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to view this page',
    )
  }
  const currentSubscription = await Subscription.findOne({user: traveler?._id, endDate: { $gte: new Date() }}).populate('package').populate('user')
  const totalPost = await Post.find({ author: traveler?._id }).countDocuments()
  const totalFollowers = traveler?.followers?.length
  const totalFollowing = traveler?.following?.length
  const totalPremiumPost = await Post.find({
    author: traveler?._id,
    isPremium: true,
  }).countDocuments()

  return {
    currentSubscription,
    totalPost,
    totalPremiumPost,
    totalFollowers,
    totalFollowing
  }
}

export const statsService = {
  getAdminStats,
  getUserStats,
}
