import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getDownloadUrl, ImageType } from '../../util/aws'
import Err from '../../util/error'
import DB from '../../model/index'

const db: DB = new DB()

const verifyPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id

  try {
    const sale = await db.findSaleById(itemId)

    if (sale === null) {
      throw new Err('존재하지 않는 sale id', 405)
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

export { verifyPurchase, getPurchase, getDetailPurchase }
