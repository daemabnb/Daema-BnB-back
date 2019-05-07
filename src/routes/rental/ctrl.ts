import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getDownloadUrl, ImageType } from '../../util/aws'
import DB from '../../model/index'

const db: DB = new DB()

const getRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query

  try {
    const shares = await db.findRentals(parseInt(offset, 10), parseInt(limit, 10))

    const responseSales = shares.map(share => {
      const { _id, name, price, returnDate, period, isPublic } = share
      const images = share.images as string[]
      const image = getDownloadUrl(ImageType.Share, _id, [images[0]])

      return {
        itemId: _id,
        itemName: name,
        itemPrice: price,
        itemImage: image,
        isFree: price === '0' ? true : false,
        returnDate,
        period,
        isPublic
      }
    })

    res.status(200).json(responseSales).end()
  } catch (e) {
    next(e)
  }
}

const getDetailRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

}

export { getRental, getDetailRental }
