import zodValidateHandler from '../../middleware/zodValidateHandler'
import { commentController } from './comment.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant' // Assuming USER_ROLE is from user module, keep it or update as needed
import {
  createCommentZodSchema,
  updateCommentZodSchema,
} from './comment.validation'
import { Router } from 'express'

const router = Router()

// Create a new comment
router.post(
  '/',
  zodValidateHandler(createCommentZodSchema),
  commentController.insertComment,
)

// Get all comments
router.get('/', commentController.getAllComments)

// Get a single comment by ID
router.get('/:id', commentController.getCommentById)

// Update a comment by ID
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  zodValidateHandler(updateCommentZodSchema),
  commentController.updateCommentById,
)

// Delete a comment by ID
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  commentController.deleteCommentById,
)

export { router as commentRouter }
