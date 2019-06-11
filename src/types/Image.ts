import { Document, Model } from 'mongoose'

export interface IImage {
  extension: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ImageDocument extends Document, IImage {}

export interface ImageModel extends Model<ImageDocument> {
  createImage(image: IImage): Promise<ImageDocument>
  findImageById(imageId: string): Promise<ImageDocument | null>
}
