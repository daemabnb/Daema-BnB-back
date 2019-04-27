import { User, IUser, UserDocument } from './user'
import { Sale, ISale, SaleDocument } from './sale'

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

  findSaleById(saleId: string): Promise<SaleDocument | null> {
    return Sale.findById(saleId).exec()
  }

  updateSale(saleId: string, sale: SaleDocument): Promise<number> {
    return Sale.updateOne({ _id: saleId }, sale).exec()
  }
}

export default DB
export { UserDocument, SaleDocument }
