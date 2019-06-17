import { Schema, Model, Document, model } from 'mongoose'
import { IShare, ShareDocument, ShareModel, ShareStatus } from '../types/Share'
import Client from '../types/Client'

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
    required: false
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

ShareSchema.statics.createShare = (share: IShare): Promise<ShareDocument> => {
  return new Share(share).save()
}

ShareSchema.statics.findShareById = (shareId: string): Promise<ShareDocument | null> => {
  return Share.findById(shareId).exec()
}

ShareSchema.statics.findOwnShares = (userId: string, skip: number, limit: number): Promise<ShareDocument[]> => {
  return Share.find({ userId }).skip(skip).limit(limit).exec()
}

ShareSchema.statics.findRentals = (skip: number, limit: number): Promise<ShareDocument[]> => {
  return Share.find({ status: ShareStatus.beforeExchage }).skip(skip).limit(limit).exec()
}

ShareSchema.statics.findOwnRental = (clientId: string, skip: number, limit: number): Promise<ShareDocument[]> => {
  return Share.find({ clientId }).skip(skip).limit(limit).exec()
}

ShareSchema.statics.updateShare = (shareId: string, share: IShare): Promise<number> => {
  return Share.updateOne({ _id: shareId }, { share }).exec()
}

ShareSchema.statics.updateShareClient = (shareId: string, status: ShareStatus, client: Client): Promise<number> => {
  return Share.updateOne({ _id: shareId }, {
    $set: {
      sharedDate: Date.now(),
      clientId: client.id,
      clientName: client.name,
      clientLink: client.link,
      status
    }
  }).exec()
}

ShareSchema.statics.updateShareStatus = (shareId: string, status: ShareStatus): Promise<number> => {
  return Share.updateOne({ _id: shareId }, {
    $set: { status }
  }).exec()
}

ShareSchema.statics.deleteShare = (shareId: string): Promise<{}> => {
  return Share.deleteOne({ _id: shareId }).exec()
}

export const Share: ShareModel = model<ShareDocument, ShareModel>('Share', ShareSchema)
