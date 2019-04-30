import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getDownloadUrl, ImageType } from '../../util/aws'
import { setSaleAuthNumber, getSaleAuthNumber } from '../../util/redis'
import Err from '../../util/error'
import DB, { SaleStatus } from '../../model/index'

const db: DB = new DB()

const verifyPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id

  try {
    const sale = await db.findSaleById(itemId)

    if (sale === null) {
      throw new Err('존재하지 않는 sale id. 저리 가!', 405)
    }

    req.sale = sale

    next()
  } catch (e) {
    next(e)
  }
}

const getPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query

  try {
    const sales = await db.findSales(parseInt(offset, 10), parseInt(limit, 10))

    const responseSales = sales.map(sale => {
      const { _id, name, price } = sale
      const images = sale.images as string[]
      const image = getDownloadUrl(ImageType.Sale, _id, [images[0]])

      return {
        itemId: _id,
        itemName: name,
        itemPrice: price,
        itemImage: image,
        isFree: price === '0' ? true : false
      }
    })

    res.status(200).json(responseSales).end()
  } catch (e) {
    next(e)
  }
}

const getDetailPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { _id, name, description, price, status, images, userId, userName, userLink } = req.sale

  const downloadUrls: string[] = getDownloadUrl(ImageType.Sale,_id, images as string[])

  res.status(200).json({
    itemId: _id,
    itemName: name,
    itemDescription: description,
    itemPrice: price,
    saleStatus: status,
    itemImages: downloadUrls,
    isFree: price === '0' ? true : false,
    userId,
    userName,
    userLink
  }).end()
}

const postPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { _id, status } = req.sale
  const { id, displayName, profileUrl } = req.user

  try {
    if (status !== SaleStatus.onSale) {
      throw new Err('안 팔아. 저리 가!', 405)
    }

    await db.updateSaleClient(_id, SaleStatus.beforeExchage, {
      id,
      name: displayName,
      link: profileUrl
    })

    await setSaleAuthNumber(_id)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

const getPurchaseHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query
  const userId = req.user.id

  try {
    const purchases = await db.findOwnPurchase(userId, offset, limit)

    const responsePurchases = purchases.map(purchase => {
      return {
        itemId: purchase._id,
        itemName: purchase.name,
        itemDescription: purchase.description,
        saleStatus: purchase.status,
        registerDate: purchase.createdAt,
        purchaseDate: purchase.selledDate
      }
    })

    res.status(200).json(responsePurchases).end()
  } catch (e) {
    next(e)
  }
}

const getExchageAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const saleId = req.sale.id
  try {
    const authNum = await getSaleAuthNumber(saleId)

    res.status(200).json({
      authPassword: authNum
    }).end()
  } catch (e) {
    next(e)
  }
}

const postExchageAuthNum: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

}

export { verifyPurchase, getPurchase, getDetailPurchase, postPurchase, getPurchaseHistory,
  getExchageAuthNum, postExchageAuthNum }
