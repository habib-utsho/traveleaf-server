import zodValidateHandler from '../../middleware/zodValidateHandler'
import { postController } from './post.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant' // Assuming USER_ROLE is from the user module, keep it or update as needed
import { createPostZodSchema, updatePostZodSchema } from './post.validation'
import { NextFunction, Request, Response, Router } from 'express'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

// Create a new post
router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createPostZodSchema),
  postController.insertPost,
)

// Get all posts
router.get('/', postController.getAllPosts)

// Get a single post by ID
router.get('/:id', postController.getPostById)

// Update a post by ID
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(updatePostZodSchema),
  postController.updatePostById,
)

// Delete a post by ID
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER), postController.deletePostById)

export { router as postRouter }
