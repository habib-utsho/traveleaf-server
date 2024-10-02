import { Schema, model, Types } from 'mongoose'
import { TComment } from './comment.interface'

const CommentSchema = new Schema<TComment>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'Traveler',
      required: [true, 'User is required'],
    },
    post: {
      type: Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },
    comment: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },
  },
  { timestamps: true },
)

// Comment model export
const Comment = model<TComment>('Comment', CommentSchema)
export default Comment
