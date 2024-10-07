import { StatusCodes } from 'http-status-codes'
import { TUser } from './user.interface'
import User from './user.model'
import AppError from '../../errors/appError'
import mongoose from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import { TTraveler } from '../traveler/traveler.interface'
import Traveler from '../traveler/traveler.model'
import { TAdmin } from '../admin/admin.interface'
import Admin from '../admin/admin.model'
import { sendEmail } from '../../utils/sendEmail'

const insertTraveler = async (
  file: any,
  payload: TTraveler & Partial<TUser>,
) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Traveler.findOne({ email: payload.email })
    if (alreadyExistEmail) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Email is already exist. Try with different email!',
      )
    }

    // file upload
    if (file?.path) {
      const cloudinaryRes = await uploadImgToCloudinary(
        `${payload.name}-${Date.now()}`,
        file.path,
      )
      if (cloudinaryRes?.secure_url) {
        payload.profileImg = cloudinaryRes.secure_url
      }
    }

    const userData: Partial<TUser> = {
      email: payload.email,
      password: payload.password,
      needsPasswordChange: false,
      role: 'traveler',
    }
    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
    }

    const travelerData: Partial<TTraveler> = {
      ...payload,
      user: user[0]._id,
    }
    // Save patient
    const traveler = await Traveler.create([travelerData], { session })
    if (!traveler?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert traveler!')
    }

    await session.commitTransaction()
    await session.endSession()

    await sendEmail({
      toEmail: payload?.email,
      subject: 'Your account is created!',
      text: `Hello, ${payload?.name} Welcome to our platform! Your account has been successfully created. You can log in using the following credentials:
    
      Email: ${payload?.email}
      Password: ${payload.password}
    
      Please keep this information secure. You can log in here: ${process.env.CLIENT_URL}/signin`,

      html: `
        <p>Welcome to our platform!</p>
        <p>Your account has been successfully created.</p>
    
        <p>You can log in using the following credentials:</p>
        
        <p><strong>Email:</strong> ${payload?.email}</p>
        <p><strong>Password:</strong> ${payload.password || process.env.ADMIN_DEFAULT_PASSWORD}</p>
    
        <div>
          <a href="${process.env.CLIENT_URL}/signin" style="background-color: #00ABE4; margin: 5px 0; cursor: pointer; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; display: inline-block;">Log in</a>
        </div>
    
      `,
    })

    return traveler[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const insertAdmin = async (file: any, payload: TAdmin & TUser) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Admin.findOne({ email: payload.email })
    const alreadyExistPhone = await Admin.findOne({ phone: payload.phone })

    if (alreadyExistEmail) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Email is already exist. Try with different email!',
      )
    }

    if (alreadyExistPhone) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Phone is already exist. Try with different phone!',
      )
    }

    // file upload
    if (file?.path) {
      const cloudinaryRes = await uploadImgToCloudinary(
        `${payload.name}-${Date.now()}`,
        file.path,
      )
      if (cloudinaryRes?.secure_url) {
        payload.profileImg = cloudinaryRes.secure_url
      }
    }

    const userData: Partial<TUser> = {
      email: payload.email,
      password: payload.password || process.env.ADMIN_DEFAULT_PASSWORD,
      needsPasswordChange: payload.password ? false : true,
      role: 'admin',
    }
    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user!')
    }

    const adminData: Partial<TAdmin> = {
      ...payload,
      user: user[0]._id,
    }
    // Save doctor
    const admin = await Admin.create([adminData], { session })
    if (!admin?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert admin!')
    }

    await session.commitTransaction()

    await sendEmail({
      toEmail: payload?.email,
      subject: 'Your admin account is created!',
      text: `Hello, ${payload?.name} Welcome to our platform! Your admin account has been successfully created. You can log in using the following credentials:
    
      Email: ${payload?.email}
      Password: ${payload.password || process.env.ADMIN_DEFAULT_PASSWORD}
    
      Please keep this information secure. You can log in here: ${process.env.CLIENT_URL}/signin`,

      html: `
        <p>Welcome to our platform!</p>
        <p>Your admin account has been successfully created.</p>
    
        <p>You can log in using the following credentials:</p>
        
        <p><strong>Email:</strong> ${payload?.email}</p>
        <p><strong>Password:</strong> ${payload.password || process.env.ADMIN_DEFAULT_PASSWORD}</p>
    
        <div>
          <a href="${process.env.CLIENT_URL}/signin" style="background-color: #00ABE4; margin: 5px 0; cursor: pointer; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; display: inline-block;">Log in</a>
        </div>
    
        <p>Please keep this information secure and change your password after logging in.</p>
      `,
    })

    return admin[0]
  } catch (err: any) {
    await session.abortTransaction()
    throw new Error(err)
  } finally {
    await session.endSession()
  }
}

const getAllUser = async () => {
  const users = await User.find({}).select('-__v')
  return users
}

const getSingleUserById = async (id: string) => {
  const user = await User.findById(id).select('-__v')
  return user
}

const getMe = async (payload: JwtPayload) => {
  let result
  if (payload.role === 'traveler') {
    result = await Traveler.findOne({ user: payload._id }).select('-__v')
  }
  if (payload.role === 'admin') {
    result = await Admin.findOne({ user: payload._id }).select('-__v')
  }

  return result
}

export const userServices = {
  insertTraveler,
  insertAdmin,
  getAllUser,
  getSingleUserById,
  getMe,
}
