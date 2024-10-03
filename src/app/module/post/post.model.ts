import { Schema, model, Types } from 'mongoose'
import { TPost } from './post.interface'

// Post Schema definition
const PostSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    banner: {
      type: String,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: Types.ObjectId,
      required: true,
      refPath: 'authorType', // Dynamically set ref based on authorType
    },
    authorType: {
      type: String,
      enum: ['Traveler', 'Admin'], // Allow only specific types
    },
    category: {
      type: Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: Types.ObjectId,
        ref: 'Traveler',
      },
    ],
    downvotedBy: [
      {
        type: Types.ObjectId,
        ref: 'Traveler',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Post model export
const Post = model<TPost>('Post', PostSchema)
export default Post
