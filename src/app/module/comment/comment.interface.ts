import { ObjectId } from 'mongoose'

type TComment = {
  user: ObjectId
  post: ObjectId
  comment: string
}

export { TComment }
