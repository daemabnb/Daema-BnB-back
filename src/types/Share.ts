import { Document, Model } from 'mongoose'
import Client from '../types/Client'

export enum ShareStatus {
  onShare = 'onShare',
  onRental = 'onRental',
  beforeExchage = 'beforeExchage',
  completeReturn = 'completeReturn',
  end = 'end'
}

export interface IShare {
  name: string
  description: string
  price: string
  returnDate: number
  period: number
  sharedDate?: number
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

export interface ShareModel extends Model<ShareDocument> {
  createShare(share: IShare): Promise<ShareDocument>
  findShareById(shareId: string): Promise<ShareDocument | null>
  findOwnShares(userId: string, skip: number, limit: number): Promise<ShareDocument[]>
  findRentals(skip: number, limit: number): Promise<ShareDocument[]>
  findOwnRental(clientId: string, skip: number, limit: number): Promise<ShareDocument[]>
  updateShare(shareId: string, share: IShare): Promise<number>
  updateShareClient(shareId: string, status: ShareStatus, client: Client): Promise<number>
  updateShareStatus(shareId: string, status: ShareStatus): Promise<number>
  updateShareStatusByTime(time: number, status: ShareStatus): Promise<{}>
  deleteShare(shareId: string): Promise<{}>
}
