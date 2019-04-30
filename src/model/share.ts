import { Schema, Model, Document, model } from 'mongoose'

interface IShare {
  name: string
  description: string
  price: string
  returnDate: Date
  period: number
  sharedDate: Date
  isPublic: boolean
  userId: string
  userName: string
  userLink: string
  clientId?: string
  clientName?: string
  clientLink?: string
  createdAt?: Date
  updatedAt?: Date
}

interface ShareDocument extends Document, IShare {}

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
    type: Date,
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

const Share: Model<ShareDocument> = model<ShareDocument>('Share', ShareSchema)

export { Share, IShare, ShareDocument }
