import { NextFunction, Request, Response } from 'express'
import { TUserRole } from '../module/user/user.interface'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/appError'
import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import User from '../module/user/user.model'
import jwtVerify from '../utils/jwtVerify'
import Admin from '../module/admin/admin.model'
import Traveler from '../module/traveler/traveler.model'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
    }

    const bearerToken = token.split(' ')?.[1]
    if (!bearerToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
    }

    // let decoded
    // try {
    //   decoded = jwt.verify(
    //     bearerToken,
    //     process.env.JWT_ACCESS_SECRET as string,
    //   ) as JwtPayload
    // } catch (e) {
    //   throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
    // }
    const decoded = (await jwtVerify(
      bearerToken,
      process.env.JWT_ACCESS_SECRET as string,
    )) as JwtPayload

    const { _id, role } = decoded

    const user = await User.findById(_id)

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'This user is not found!')
    }

    // checking if the user is blocked or not
    const isBlocked = user?.isBlocked

    if (isBlocked) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked!')
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
    }

    let updatedDecoded
    if (decoded.role === 'admin') {
      const admin = await Admin.findOne({ user: _id })
      updatedDecoded = {
        ...decoded,
        user: admin?._id,
        profileImg: admin?.profileImg,
        name: admin?.name,
        phone: admin?.phone,
      }
    }
    if (decoded.role === 'traveler') {
      const traveler = await Traveler.findOne({ user: _id })
      updatedDecoded = {
        ...decoded,
        user: traveler?._id,
        profileImg: traveler?.profileImg,
        name: traveler?.name,
        phone: traveler?.phone,
      }
    }
    req.user = updatedDecoded as JwtPayload

    next()
  })
}

export default auth
