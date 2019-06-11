import { User } from './user'
import { Sale } from './sale'
import { Share } from './share'
import { Image } from './image'
import { IUser, UserDocument } from '../types/User'
import { ISale, SaleDocument } from '../types/Sale'
import { IShare, ShareDocument } from '../types/Share'
import { IImage, ImageDocument } from '../types/Image'
import Client from '../types/Client'

export enum SaleStatus {
  onSale = 'onSale',
  beforeExchage = 'beforeExchage',
  selled = 'selled'
}

export enum ShareStatus {
  onShare = 'onShare',
  onRental = 'onRental',
  beforeExchage = 'beforeExchage',
  completeReturn = 'completeReturn',
  end = 'end'
}

export default class DB {
  createUser(user: IUser): Promise<UserDocument> {
    return new User(user).save()
  }

  findUserById(userId: string): Promise<UserDocument | null> {
    return User.findOne({ id: userId }).exec()
  }

  createSale(sale: ISale): Promise<SaleDocument> {
    return new Sale(sale).save()
  }

  findSales(skip: number, limit: number): Promise<SaleDocument[]> {
    return Sale.find().skip(skip).limit(limit).exec()
  }

  findOwnSales(userId: string, skip: number, limit: number): Promise<SaleDocument[]> {
    return Sale.find({ userId }).skip(skip).limit(limit).exec()
  }

  findPurchases(skip: number, limit: number): Promise<SaleDocument[]> {
    return Share.find({ status: SaleStatus.beforeExchage }).skip(skip).limit(limit).exec()
  }

  findOwnPurchase(clientId: string, skip: number, limit: number): Promise<SaleDocument[]> {
    return Sale.find({ clientId }).skip(skip).limit(limit).exec()
  }

  findSaleById(saleId: string): Promise<SaleDocument | null> {
    return Sale.findById(saleId).exec()
  }

  updateSale(saleId: string, sale: ISale): Promise<number> {
    return Sale.updateOne({ _id: saleId }, sale).exec()
  }

  deleteSale(saleId: string): Promise<{}> {
    return Sale.deleteOne({ _id: saleId }).exec()
  }

  updateSaleClient(saleId: string, status: SaleStatus, client: Client): Promise<number> {
    return Sale.updateOne({ _id: saleId }, {
      $set: {
        clientId: client.id,
        clientName: client.name,
        clientLink: client.link,
        status
      }
    }).exec()
  }

  updateSaleStatus(saleId: string, status: SaleStatus): Promise<number> {
    return Sale.updateOne({ _id: saleId }, {
      $set: { status }
    }).exec()
  }

  createShare(share: IShare): Promise<ShareDocument> {
    return new Share(share).save()
  }

  findShareById(shareId: string): Promise<ShareDocument | null> {
    return Share.findById(shareId).exec()
  }

  findOwnShares(userId: string, skip: number, limit: number): Promise<ShareDocument[]> {
    return Share.find({ userId }).skip(skip).limit(limit).exec()
  }

  findRentals(skip: number, limit: number): Promise<ShareDocument[]> {
    return Share.find({ status: ShareStatus.beforeExchage }).skip(skip).limit(limit).exec()
  }

  findOwnRental(clientId: string, skip: number, limit: number): Promise<ShareDocument[]> {
    return Share.find({ clientId }).skip(skip).limit(limit).exec()
  }

  updateShare(shareId: string, share: IShare): Promise<number> {
    return Share.updateOne({ _id: shareId }, { share }).exec()
  }

  deleteShare(shareId: string): Promise<{}> {
    return Share.deleteOne({ _id: shareId }).exec()
  }

  updateShareClient(shareId: string, status: ShareStatus, client: Client): Promise<number> {
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

  updateShareStatus(shareId: string, status: ShareStatus): Promise<number> {
    return Share.updateOne({ _id: shareId }, {
      $set: { status }
    }).exec()
  }

  updateShareStatusByTime(time: number, status: ShareStatus) {
    return Share.updateMany({
      returnDate: { $lt: time },
      status: { $ne: ShareStatus.end }
    }, {
      $set: { status }
    }).exec()
  }

  createImage(image: IImage): Promise<ImageDocument> {
    return new Image(image).save()
  }

  findImageById(imageId: string): Promise<ImageDocument | null> {
    return Image.findById(imageId).exec()
  }
}

export { UserDocument, SaleDocument, ShareDocument, ImageDocument }
