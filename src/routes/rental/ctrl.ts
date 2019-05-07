import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getDownloadUrl, ImageType } from '../../util/aws'
import DB, { ShareStatus } from '../../model/index'
import { setShareAuthNumber } from '../../util/redis'
import Err from '../../util/error'

const db: DB = new DB()

const verifyRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id

  try {
    const share = await db.findShareById(itemId)

    if (share === null) {
      throw new Err('존재하지 않는 sale id. 저리 가!', 405)
    }

    req.share = share

    next()
  } catch (e) {
    next(e)
  }
}

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
  const { _id, name, description, price, status, images, returnDate, period, isPublic, userId, userName, userLink }
  = req.share

  const downloadUrls: string[] = getDownloadUrl(ImageType.Share,_id, images as string[])

  res.status(200).json({
    itemId: _id,
    itemName: name,
    itemDescription: description,
    itemPrice: price,
    saleStatus: status,
    itemImages: downloadUrls,
    isFree: price === '0' ? true : false,
    returnDate,
    period,
    userId,
    userName,
    userLink
  }).end()
}

const postRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { _id, status } = req.share
  const { id, displayName, profileUrl } = req.user

  try {
    if (status !== ShareStatus.onShare) {
      throw new Err('안 팔아. 저리 가!', 405)
    }

    await db.updateShareClient(_id, ShareStatus.beforeExchage, {
      id,
      name: displayName,
      link: profileUrl
    })

    await setShareAuthNumber(_id)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

const getRentalHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

}

export { verifyRental, getRental, getDetailRental, postRental, getRentalHistory }
