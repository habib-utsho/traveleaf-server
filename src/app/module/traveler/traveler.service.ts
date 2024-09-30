import QueryBuilder from '../../builder/QueryBuilder'
import { travelerSearchableFields } from './traveler.constant'
import Traveler from './traveler.model' // Import Traveler model

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
    .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }])

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

// const updateTravelerById = async (id: string, payload: Partial<TTraveler>) => {
//   const { name, guardian, ...restTravelerData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restTravelerData,
//   }

//   // update non-primitive values
//   // Update name
//   if (name && Object.keys(name)?.length > 0) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value
//     }
//   }
//   // update guardian
//   if (guardian && Object.keys(guardian)?.length > 0) {
//     for (const [key, value] of Object.entries(guardian)) {
//       modifiedUpdatedData[`guardian.${key}`] = value
//     }
//   }

//   const traveler = await Traveler.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')

//   return traveler
// }

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
  // updateTravelerById, // Change to updateTravelerById
  deleteTravelerById, // Change to deleteTravelerById
}
