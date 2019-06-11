import { Schema, Model, Document, model } from 'mongoose'

export interface IImage {
  extension: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ImageDocument extends Document, IImage {}

const ImageSchema: Schema = new Schema({
  extension: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

export const Image: Model<ImageDocument> = model<ImageDocument>('Image', ImageSchema)
