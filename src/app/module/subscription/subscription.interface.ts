import { Types } from 'mongoose'

export interface TSubscription {
  user: Types.ObjectId
  package: Types.ObjectId
  startDate: Date // The date the subscription starts
  endDate: Date // The date the subscription ends
  isActive: boolean // Indicates if the subscription is currently active
}
