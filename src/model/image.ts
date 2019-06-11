import { Schema, Model, model } from 'mongoose'
import { IImage, ImageDocument, ImageModel } from '../types/Image'

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

ImageSchema.statics.createImage = (image: IImage): Promise<ImageDocument> => {
  return new Image(image).save()
}

ImageSchema.statics.findImageById = (imageId: string): Promise<ImageDocument | null> => {
  return Image.findById(imageId).exec()
}

export const Image: ImageModel = model<ImageDocument, ImageModel>('Image', ImageSchema)
