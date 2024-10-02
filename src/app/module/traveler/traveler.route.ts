import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { travelerController } from './traveler.controller'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), travelerController.getAllTravelers)
router.get('/:id', auth(USER_ROLE.ADMIN), travelerController.getTravelerById)
// router.patch(
//   '/:id',
//   auth(USER_ROLE.ADMIN),
//   zodValidateHandler(updateStudentZodSchema),
//   studentController.updateStudentById,
// )

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  travelerController.deleteTravelerById,
)

export { router as travelerRouter }
