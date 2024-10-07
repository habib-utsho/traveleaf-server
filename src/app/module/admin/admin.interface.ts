import { Types } from 'mongoose'
import { TDistrict, TGender } from '../traveler/traveler.interface'

export type TAdmin = {
  user: Types.ObjectId
  name: string
  email: string
  phone: string
  gender: TGender
  profileImg?: string
  dateOfBirth: Date
  district: TDistrict
  postsCount: number
  nid: number
  isDeleted: boolean
}
