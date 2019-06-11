import { Document, Model } from 'mongoose'
import Client from './Client'

export enum SaleStatus {
  onSale = 'onSale',
  beforeExchage = 'beforeExchage',
  selled = 'selled'
}

export interface ISale {
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
  selledDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface SaleDocument extends Document, ISale {}

export interface SaleModel extends Model<SaleDocument> {
  createSale(sale: ISale): Promise<SaleDocument>
  findSaleById(saleId: string): Promise<SaleDocument | null>
  findSales(skip: number, limit: number): Promise<SaleDocument[]>
  findOwnSales(userId: string, skip: number, limit: number): Promise<SaleDocument[]>
  findPurchases(skip: number, limit: number): Promise<SaleDocument[]>
  findOwnPurchase(clientId: string, skip: number, limit: number): Promise<SaleDocument[]>
  updateSale(saleId: string, sale: ISale): Promise<number>
  updateSaleClient(saleId: string, status: SaleStatus, client: Client): Promise<number>
  updateSaleStatus(saleId: string, status: SaleStatus): Promise<number>
  deleteSale(saleId: string): Promise<{}>
}
