import { Schema, model } from 'mongoose'
import { TSubscription } from './subscription.interface'

const SubscriptionSchema = new Schema<TSubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Traveler', // Reference to User model
    },
    package: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Package', // Reference to Package model
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true, // Active or inactive subscription
    },
  },
  { timestamps: true },
)

const Subscription = model<TSubscription>('Subscription', SubscriptionSchema)

export default Subscription
