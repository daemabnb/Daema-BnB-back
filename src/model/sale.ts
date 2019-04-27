import { Schema, Model, Document, model, Types } from 'mongoose'

interface ISale {
  name: string
  description: string
  price: string
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

interface SaleDocument extends Document, ISale {}

const SaleSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: String,
    default: 0
  },
  status: {
    type: String,
    default: '판매 중'
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

const Sale: Model<SaleDocument> = model<SaleDocument>('Sale', SaleSchema)

export { Sale, ISale, SaleDocument }
