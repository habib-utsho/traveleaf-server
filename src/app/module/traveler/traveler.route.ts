import { NextFunction, Request, Response, Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { travelerController } from './traveler.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { updateTravelerZodSchema } from './traveler.validation'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), travelerController.getAllTravelers)
router.get('/:id', travelerController.getTravelerById)
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(updateTravelerZodSchema),
  travelerController.updateTravelerById,
)

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  travelerController.deleteTravelerById,
)

router.patch(
  '/follow-traveler/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  travelerController.followTravelerById,
)

router.patch(
  '/unfollow-traveler/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  travelerController.unfollowTravelerById,
)

export { router as travelerRouter }
