import { User, IUser, UserDocument } from './user'
import { Sale, ISale, SaleDocument } from './sale'

enum SaleStatus {
  onSale = 'onSale',
  beforeExchage = 'beforeExchage',
  selled = 'selled'
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

  findSaleById(saleId: string): Promise<SaleDocument | null> {
    return Sale.findById(saleId).exec()
  }

  updateSale(saleId: string, sale: ISale): Promise<number> {
    return Sale.updateOne({ _id: saleId }, sale).exec()
  }

  deleteSale(saleId: string): Promise<{}> {
    return Sale.deleteOne({ _id: saleId }).exec()
  }

  updateSaleStatus(saleId: string, status: string): Promise<number> {
    return Sale.updateOne({ _id: saleId }, {
      $set: { status }
    }).exec()
  }
}

export default DB
export { UserDocument, SaleDocument, SaleStatus }
