import { Schema, model } from 'mongoose'
import { TPackage } from './package.interface'

const PackageSchema = new Schema<TPackage>(
  {
    name: {
      type: String,
      required: true,
      enum: ['Basic', 'Standard', 'Premium'], // List of available plans
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0, // Default price
    },
    durationInMonths: {
      type: Number,
      required: true,
      default: 1, // Default to 1 month
      min: 1,
    },
    currencyType: {
      type: String,
      default: 'BDT', // Default currency type
      enum: ['BDT', 'USD', 'EUR'], // Add more currencies as needed
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Package = model<TPackage>('Package', PackageSchema)

export default Package
