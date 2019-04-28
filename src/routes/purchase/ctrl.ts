import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getDownloadUrl, ImageType } from '../../util/aws'
import DB from '../../model/index'

const db: DB = new DB()

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

export { getPurchase }
