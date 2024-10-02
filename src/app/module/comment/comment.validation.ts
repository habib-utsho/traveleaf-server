import { z } from 'zod'

const createCommentZodSchema = z.object({
  user: z.string({ required_error: 'User Id is required' }),
  post: z.string({ required_error: 'Post Id is required' }),
  comment: z.string({ required_error: 'Comment is required' }),
})
const updateCommentZodSchema = z.object({
  user: z.string().optional(),
  post: z.string().optional(),
  comment: z.string().optional(),
})

export { createCommentZodSchema, updateCommentZodSchema }
