import { z } from 'zod'

// Define Zod schema for creating a package
const createPackageZodSchema = z.object({
  name: z.enum(['Basic', 'Standard', 'Premium'], {
    required_error: 'Package name is required',
  }),
  currencyType: z.enum(['BDT', 'USD', 'EUR']).optional().default('BDT'), // Default to BDT if not provided
  isDeleted: z.boolean().optional().default(false), // Default to false
})

// Define Zod schema for updating a package
const updatePackageZodSchema = z.object({
  name: z.enum(['Basic', 'Standard', 'Premium']).optional(),
  price: z
    .number()
    .min(0, { message: 'Price must be a non-negative number' })
    .optional(),
  durationInMonths: z
    .number()
    .min(1, { message: 'Duration must be at least 1 month' })
    .optional(),
  currencyType: z.enum(['BDT', 'USD', 'EUR']).optional(),
  isDeleted: z.boolean().optional(),
})

export { createPackageZodSchema, updatePackageZodSchema }
