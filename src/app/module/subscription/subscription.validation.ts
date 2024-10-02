import { z } from 'zod'

// Define Zod schema for creating a subscription
const createSubscriptionZodSchema = z.object({
  user: z.string({
    required_error: 'User ID is required',
  }),
  package: z.string({
    required_error: 'Package ID is required',
  }),
  isActive: z.boolean().optional().default(true), // Default to active if not provided
})

export { createSubscriptionZodSchema }
