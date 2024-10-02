import { NextFunction, Request, Response, Router } from 'express'

import zodValidateHandler from '../../middleware/zodValidateHandler'

import { userController } from './user.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from './user.constant'
import { upload } from '../../utils/uploadImgToCloudinary'
import { createAdminZodSchema } from '../admin/admin.validation'
import { createTravelerZodSchema } from '../traveler/traveler.validation'

const router = Router()

router.post(
  '/create-traveler',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createTravelerZodSchema),
  userController.insertTraveler,
)

router.post(
  '/create-admin',
  // auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createAdminZodSchema),
  userController.insertAdmin,
)
// router.post(
//   '/create-admin',
//   zodValidateHandler(createAdminZodSchema),
//   userController.insertAdmin,
// )

router.get(
  '/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  userController.getMe,
)

router.get('/', auth(USER_ROLE.ADMIN), userController.getAllUsers)
router.get('/:id', auth(USER_ROLE.ADMIN), userController.getUserById)

export { router as userRouter }
