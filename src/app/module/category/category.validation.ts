import { z } from 'zod'

const createCategoryZodSchema = z.object({
  name: z.string({ required_error: 'Category name is required' }),
})
const updateCategoryZodSchema = z.object({
  name: z.string().optional(),
})

export { createCategoryZodSchema, updateCategoryZodSchema }
