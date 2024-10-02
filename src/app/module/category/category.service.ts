import { StatusCodes } from 'http-status-codes'
import { TCategory } from './category.interface'
import Category from './category.model'
import AppError from '../../errors/appError'
import QueryBuilder from '../../builder/QueryBuilder'
import { categorySearchableFields } from './category.constant'

const insertCategory = async (payload: TCategory) => {
  const category = await Category.create(payload)

  return category
}

const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .searchQuery(categorySearchableFields)
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()

  const result = await categoryQuery?.queryModel
  const total = await Category.countDocuments(
    categoryQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id).select('-__v')
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!')
  }
  return category
}

const updateCategoryById = async (id: string, payload: Partial<TCategory>) => {
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!')
  }
  return category
}
const deleteCategoryById = async (id: string) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  )
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!')
  }
  return category
}

export const categoryServices = {
  insertCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
}
