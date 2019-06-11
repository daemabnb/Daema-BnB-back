import { Schema, Model, model } from 'mongoose'
import { ISale, SaleDocument, SaleModel, SaleStatus } from '../types/Sale'
import Client from '../types/Client'

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
  selledDate: {
    type: Date
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

SaleSchema.statics.craeteSale = (sale: ISale): Promise<SaleDocument> => {
  return new Sale(sale).save()
}

SaleSchema.statics.findSaleById = (saleId: string): Promise<SaleDocument | null> => {
  return Sale.findById(saleId).exec()
}

SaleSchema.statics.findSales = (skip: number, limit: number): Promise<SaleDocument[]> => {
  return Sale.find().skip(skip).limit(limit).exec()
}

SaleSchema.statics.findOwnSales = (userId: string, skip: number, limit: number): Promise<SaleDocument[]> => {
  return Sale.find({ userId }).skip(skip).limit(limit).exec()
}

SaleSchema.statics.findPurchases = (skip: number, limit: number): Promise<SaleDocument[]> => {
  return Sale.find({ status: SaleStatus.beforeExchage }).skip(skip).limit(limit).exec()
}

SaleSchema.statics.findOwnPurchase = (clientId: string, skip: number, limit: number): Promise<SaleDocument[]> => {
  return Sale.find({ clientId }).skip(skip).limit(limit).exec()
}

SaleSchema.statics.updateSale = (saleId: string, sale: ISale): Promise<number> => {
  return Sale.updateOne({ _id: saleId }, sale).exec()
}

SaleSchema.statics.updateSaleClient = (saleId: string, status: SaleStatus, client: Client): Promise<number> => {
  return Sale.updateOne({ _id: saleId }, {
    $set: {
      clientId: client.id,
      clientName: client.name,
      clientLink: client.link,
      status
    }
  }).exec()
}

SaleSchema.statics.updateSaleStatus = (saleId: string, status: SaleStatus): Promise<number> => {
  return Sale.updateOne({ _id: saleId }, {
    $set: { status }
  }).exec()
}

SaleSchema.statics.deleteSale = (saleId: string): Promise<{}> => {
  return Sale.deleteOne({ _id: saleId }).exec()
}

export const Sale: Model<SaleDocument> = model<SaleDocument, SaleModel>('Sale', SaleSchema)
