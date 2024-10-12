import { Types } from "mongoose"


type TPost = {
  title: string
  banner: string
  content: string
  author: Types.ObjectId
  authorType: 'Traveler' | 'Admin'
  category: Types.ObjectId
  isPremium: boolean
  votes: number
  upvotedBy: Types.ObjectId[]
  downvotedBy: Types.ObjectId[]
  isDeleted: boolean
}

export { TPost }
