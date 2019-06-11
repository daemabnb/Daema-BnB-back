import { Schema, Model, Document, model } from 'mongoose'

export interface IShare {
  name: string
  description: string
  price: string
  returnDate: Number
  period: number
  sharedDate?: Number
  isPublic: boolean
  status?: string
  images?: string[]
  userId: string
  userName: string
  userLink: string
  clientId?: string
  clientName?: string
  clientLink?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ShareDocument extends Document, IShare {}

const ShareSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  returnDate: {
    type: Number,
    required: true
  },
  period: {
    type: Number,
    required: true
  },
  sharedDate: {
    type: Number,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    default: 'onShare'
  },
  images: {
    type: [
      String
    ],
    default: []
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userLink: {
    type: String,
    required: true
  },
  clientId: {
    type: String
  },
  clientName: {
    type: String
  },
  clientLink: {
    type: String
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

export const Share: Model<ShareDocument> = model<ShareDocument>('Share', ShareSchema)
