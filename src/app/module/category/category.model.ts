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
  console.log('create middlware', this.name, this.slug)

  next()
})

CategorySchema.pre('findOneAndUpdate', function (next) {
  const update = (this as any).getUpdate() as Partial<TCategory>

  // Check if 'name' is being updated
  if (update?.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
      replacement: '_',
    })
    ;(this as any).setUpdate(update)
  }

  next()
})

const Category = model<TCategory>('Category', CategorySchema)
export default Category
