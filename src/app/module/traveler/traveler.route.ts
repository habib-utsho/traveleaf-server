import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { travelerController } from './traveler.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { updateTravelerZodSchema } from './traveler.validation'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), travelerController.getAllTravelers)
router.get('/:id', travelerController.getTravelerById)
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  zodValidateHandler(updateTravelerZodSchema),
  travelerController.updateTravelerById,
)

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  travelerController.deleteTravelerById,
)

export { router as travelerRouter }
