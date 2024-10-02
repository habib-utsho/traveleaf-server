import zodValidateHandler from '../../middleware/zodValidateHandler'
import { categoryController } from './category.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant' // Assuming USER_ROLE is from user module, keep it or update as needed
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from './category.validation'
import { Router } from 'express'

const router = Router()

// Create a new category
router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  zodValidateHandler(createCategoryZodSchema),
  categoryController.insertCategory,
)

// Get all categories
router.get('/', categoryController.getAllCategories)

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById)
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  zodValidateHandler(updateCategoryZodSchema),
  categoryController.updateCategoryById,
)
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  categoryController.deleteCategoryById,
)

export { router as categoryRouter }
