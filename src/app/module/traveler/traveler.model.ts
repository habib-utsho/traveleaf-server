import { Schema, model } from 'mongoose'
import { districts } from './traveler.constant'
import { TTraveler } from './traveler.interface'

const travelerSchema = new Schema<TTraveler>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    profileImg: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other '],
    },
    status: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'Traveler',
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'Traveler',
    },
    district: {
      type: String,
      required: true,
      enum: districts,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Traveler Model
const Traveler = model('Traveler', travelerSchema)

export default Traveler
