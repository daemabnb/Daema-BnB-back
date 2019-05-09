import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getDownloadUrl, ImageType } from '../../util/aws'
import DB, { ShareStatus } from '../../model/index'
import { setShareAuthNumber, getShareAuthNumber, setReturnAuthNumber, getReturnAuthNumber } from '../../util/redis'
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
  const { offset, limit } = req.query
  const userId = req.user.id

  try {
    const rentals = await db.findOwnRental(userId, offset, limit)

    const responseRentals = rentals.map(rental => {
      return {
        itemId: rental._id,
        itemName: rental.name,
        itemDescription: rental.description,
        shareStatus: rental.status,
        registerDate: rental.createdAt,
        sharedDate: rental.sharedDate,
        returnDate: rental.returnDate,
        period: rental.period,
        isPublic: rental.isPublic
      }
    })

    res.status(200).json(responseRentals).end()
  } catch (e) {
    next(e)
  }
}

const getExchangeAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const shareId = req.share.id

  try {
    const authNum = await getShareAuthNumber(shareId)

    res.status(200).json({
      authPassword: authNum
    }).end()
  } catch (e) {
    next(e)
  }
}

const postExchangeAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const shareId = req.share.id

  try {
    const authNum = await getShareAuthNumber(shareId)

    if (authNum === null || authNum !== req.body.authPassword) {
      throw new Err('그런 번호 없어. 저리 가!', 405)
    }

    await db.updateShareStatus(shareId, ShareStatus.onRental)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

const getReturnAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const shareId = req.share.id

  try {
    const authNum = await getReturnAuthNumber(shareId)

    res.status(200).json({
      authPassword: authNum
    }).end()
  } catch (e) {
    next(e)
  }
}

export { verifyRental, getRental, getDetailRental, postRental, getRentalHistory,
  getExchangeAuthNum, postExchangeAuthNum, getReturnAuthNum }
