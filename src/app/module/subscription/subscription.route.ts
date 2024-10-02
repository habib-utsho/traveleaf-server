import { Router } from 'express'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { subscriptionController } from './subscription.controller'
import { createSubscriptionZodSchema } from './subscription.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

// Create a new subscription
router.post(
  '/',
  auth(USER_ROLE.TRAVELER),
  zodValidateHandler(createSubscriptionZodSchema),
  subscriptionController.insertSubscription,
)

// Get all subscriptions
router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.TRAVELER),
  subscriptionController.getAllSubscriptions,
)

// Get a single subscription by ID
router.get(
  '/:id',
  auth(USER_ROLE.ADMIN),
  subscriptionController.getSubscriptionById,
)

// Delete a subscription by ID
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  subscriptionController.deleteSubscriptionById,
)

export { router as subscriptionRouter }
