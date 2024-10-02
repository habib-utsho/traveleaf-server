import { z } from 'zod'

// Post creation schema
const createPostZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  content: z.string({ required_error: 'Content is required' }),
  category: z.string({ required_error: 'Category is required' }),
  isPremium: z.boolean().optional(), // Optional, default false in the model
})

// Post update schema
const updatePostZodSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  isPremium: z.boolean().optional(),
})

export { createPostZodSchema, updatePostZodSchema }
