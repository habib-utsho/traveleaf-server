/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose'
import { TCategory } from './category.interface'
import slugify from 'slugify'

const CategorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Pre-save hook to auto-generate slug from name
CategorySchema.pre<TCategory>('save', function (next: (err?: any) => void) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    replacement: '_',
  })
  next()
})

const Category = model<TCategory>('Category', CategorySchema)
export default Category
