import zodValidateHandler from '../../middleware/zodValidateHandler'
import { packageController } from './package.controller' // Ensure the correct controller is imported
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant' // Assuming USER_ROLE is from user module
import {
  createPackageZodSchema,
  updatePackageZodSchema,
} from './package.validation' // Ensure the correct validation is imported
import { Router } from 'express'

const router = Router()

// Create a new package
router.post(
  '/',
  auth(USER_ROLE.ADMIN), // Assuming only admin can create packages
  zodValidateHandler(createPackageZodSchema),
  packageController.insertPackage, // Ensure the correct function is called
)

// Get all packages
router.get('/', packageController.getAllPackages) // Adjust the method name in the controller

// Get a single package by ID
router.get('/:id', packageController.getPackageById) // Adjust the method name in the controller

// Update a package by ID
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  zodValidateHandler(updatePackageZodSchema),
  packageController.updatePackageById, // Ensure the correct function is called
)

// Delete a package by ID
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  packageController.deletePackageById, // Ensure the correct function is called
)

export { router as packageRouter } // Export the router with a relevant name
