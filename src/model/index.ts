import { User, IUser, UserDocument } from './user'
import { Sale, ISale, SaleDocument } from './sale'
import { Share, IShare, ShareDocument } from './share'
import { Image, IImage, ImageDocument } from './image'

enum SaleStatus {
  onSale = 'onSale',
  beforeExchage = 'beforeExchage',
  selled = 'selled'
}

interface SaleClient {
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

  updateSaleClient(saleId: string, status: string, client: SaleClient): Promise<number> {
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

  createImage(image: IImage): Promise<ImageDocument> {
    return new Image(image).save()
  }

  findImageById(imageId: string): Promise<ImageDocument | null> {
    return Image.findById(imageId).exec()
  }
}

export default DB
export { UserDocument, SaleDocument, ShareDocument, ImageDocument, SaleStatus }
