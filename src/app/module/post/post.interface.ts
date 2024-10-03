import { ObjectId } from 'mongoose'

type TPost = {
  title: string
  banner: string
  content: string
  author: ObjectId
  authorType: 'Traveler' | 'Admin'
  category: ObjectId
  isPremium: boolean
  upvotes: number
  downvotes: number
  upvotedBy: ObjectId[]
  downvotedBy: ObjectId[]
  isDeleted: boolean
}

export { TPost }
