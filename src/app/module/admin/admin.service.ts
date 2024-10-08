import { JwtPayload } from 'jsonwebtoken'
import QueryBuilder from '../../builder/QueryBuilder'
import { adminSearchableFields } from './admin.constant'
import Admin from './admin.model' // Import Admin model
import { TAdmin } from './admin.interface'
import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'

const getAllAdmins = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), {
    ...query,
    sort: `${query.sort} isDeleted`,
  })
    .searchQuery(adminSearchableFields) // Use the Admin searchable fields
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }])

  const result = await adminQuery?.queryModel
  const total = await Admin.countDocuments(adminQuery.queryModel.getFilter())
  return { data: result, total }
}

const getAdminById = async (id: string) => {
  const admin = await Admin.findOne({ _id: id }) // Use _id instead of id
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v')
  return admin
}

const updateAdminById = async (
  id: string,
  file: any,
  currUser: JwtPayload,
  payload: Partial<TAdmin>,
) => {
  // Find the admin based on the current user
  const existAdmin = await Admin.findOne({ user: currUser?._id })
  const updateAdmin = await Admin.findById(id)

  // If the admin does not exist
  if (!existAdmin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found!')
  }

  // If the current user is not allowed to update the admin
  if (updateAdmin?._id.toString() !== existAdmin?._id.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not allowed to update this admin!',
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

  // Update the admin with the provided payload
  const admin = await Admin.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v -password')

  return admin
}

const deleteAdminById = async (id: string) => {
  const admin = await Admin.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return admin
}

export const adminServices = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
}
