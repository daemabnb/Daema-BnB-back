import { User, IUser, UserDocument } from './user'
import { Sale, ISale, SaleDocument } from './sale'
import { Share, IShare, ShareDocument } from './share'
import { Image, IImage, ImageDocument } from './image'

enum SaleStatus {
  onSale = 'onSale',
  beforeExchage = 'beforeExchage',
  selled = 'selled'
}

enum ShareStatus {
  onShare = 'onShare',
  onRental = 'onRental',
  beforeExchage = 'beforeExchage'
}

interface Client {
  id: string
  name: string
  link: string
}

class DB {
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

  createImage(image: IImage): Promise<ImageDocument> {
    return new Image(image).save()
  }

  findImageById(imageId: string): Promise<ImageDocument | null> {
    return Image.findById(imageId).exec()
  }
}

export default DB
export { UserDocument, SaleDocument, ShareDocument, ImageDocument, SaleStatus, ShareStatus }
