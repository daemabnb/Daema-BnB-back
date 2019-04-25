import { Schema, Model, Document, model, Types } from 'mongoose'

interface SaleFormat extends Document {
  name: string
  description: string
  price: number
  status: string
  imagePath: Array<string>
  userId: Types.ObjectId
  userName: string
  userLink: string
  clientId: Types.ObjectId
  clientName: string
  clientLink: string
  createdAt: Date
  updatedAt: Date
}

const SaleSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    default: 0
  },
  status: {
    type: String,
    default: '판매 중'
  },
  imagePath: {
    type: [
      String
    ],
    default: []
  },
  userId: {
    type: Types.ObjectId
  },
  userName: {
    type: String
  },
  userLink: {
    type: String
  },
  clientId: {
    type: Types.ObjectId
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

const Sale: Model<SaleFormat> = model<SaleFormat>('Sale', SaleSchema)

export { Sale, SaleFormat }
