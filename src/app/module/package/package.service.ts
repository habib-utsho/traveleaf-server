import { StatusCodes } from 'http-status-codes'
import { TPackage } from './package.interface'
import Package from './package.model'
import AppError from '../../errors/appError'
import QueryBuilder from '../../builder/QueryBuilder'
import { packageSearchableFields } from './package.constant'

const insertPackage = async (payload: TPackage) => {
  let updatedPayload = { ...payload }
  if (payload?.name === 'Basic') {
    updatedPayload = { ...payload, price: 500, durationInMonths: 1 }
  } else if (payload?.name === 'Standard') {
    updatedPayload = { ...payload, price: 1000, durationInMonths: 3 }
  } else if (payload?.name === 'Premium') {
    updatedPayload = { ...payload, price: 1500, durationInMonths: 6 }
  }
  const packageData = await Package.create(updatedPayload)
  return packageData
}

const getAllPackages = async (query: Record<string, unknown>) => {
  const packageQuery = new QueryBuilder(Package.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .searchQuery(packageSearchableFields)
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()

  const result = await packageQuery?.queryModel
  const total = await Package.countDocuments(
    packageQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getPackageById = async (id: string) => {
  const packageData = await Package.findById(id).select('-__v')
  if (!packageData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  return packageData
}

const updatePackageById = async (id: string, payload: Partial<TPackage>) => {
  const packageData = await Package.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!packageData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  return packageData
}

const deletePackageById = async (id: string) => {
  const packageData = await Package.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  if (!packageData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Package not found!')
  }
  return packageData
}

export const packageServices = {
  insertPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
}
