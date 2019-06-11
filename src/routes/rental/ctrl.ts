import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Share } from '../../model/share'
import { ShareStatus } from '../../types/Share'
import { getDownloadUrl, ImageType } from '../../util/aws'
import { setShareAuthNumber, getShareAuthNumber, getReturnAuthNumber } from '../../util/redis'
import Err from '../../util/error'
import logger from '../../util/logger'

export const verifyRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id

  try {
    const share = await Share.findShareById(itemId)

    if (share === null) {
      throw new Err('존재하지 않는 sale id. 저리 가!', 405)
    }

    req.share = share

    next()
  } catch (e) {
    next(e)
  }
}

export const getRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query

  try {
    const shares = await Share.findRentals(parseInt(offset, 10), parseInt(limit, 10))

    const responseSales = shares.map(share => {
      const { _id, name, price, returnDate, period, isPublic } = share
      const images = share.images as string[]
      const image = getDownloadUrl(ImageType.Share, _id, [images[0]])

      return {
        itemId: _id,
        itemName: name,
        itemPrice: price,
        itemImages: image,
        isFree: price === '0' ? true : false,
        deadline: returnDate,
        period,
        isPublic
      }
    })

    res.status(200).json(responseSales).end()
  } catch (e) {
    next(e)
  }
}

export const getDetailRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { _id, name, description, price, status, images, returnDate, sharedDate, period, isPublic,
    userId, userName, userLink, clientId, clientName, clientLink } = req.share

  const downloadUrls: string[] = getDownloadUrl(ImageType.Share,_id, images as string[])

  res.status(200).json({
    itemId: _id,
    itemName: name,
    itemDescription: description,
    itemPrice: price,
    saleStatus: status,
    itemImages: downloadUrls,
    isFree: price === '0' ? true : false,
    isPublic,
    sharedDate,
    deadline: returnDate,
    period,
    ownerId: userId,
    ownerName: userName,
    ownerLink: userLink,
    clientId,
    clientName,
    clientLink
  }).end()
}

export const postRental: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { _id, status } = req.share
  const { id, displayName, profileUrl } = req.user

  try {
    if (status !== ShareStatus.onShare) {
      throw new Err('안 팔아. 저리 가!', 405)
    }

    await Share.updateShareClient(_id, ShareStatus.beforeExchage, {
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

export const getRentalHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query
  const userId = req.user.id

  try {
    const rentals = await Share.findOwnRental(userId, offset, limit)

    const responseRentals = rentals.map(rental => {
      const { _id, name, description, status, createdAt, sharedDate, returnDate, period, isPublic, userName } = rental

      return {
        itemId: _id,
        itemName: name,
        itemDescription: description,
        shareStatus: status,
        registerDate: createdAt,
        sharedDate: sharedDate,
        deadline: returnDate,
        period: period,
        isPublic: isPublic,
        ownerName: userName
      }
    })

    res.status(200).json(responseRentals).end()
  } catch (e) {
    next(e)
  }
}

export const getExchangeAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const postExchangeAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const shareId = req.share.id

  try {
    const authNum = await getShareAuthNumber(shareId)

    if (authNum === null || authNum !== req.body.authPassword) {
      throw new Err('그런 번호 없어. 저리 가!', 405)
    }

    await Share.updateShareStatus(shareId, ShareStatus.onRental)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

export const getReturnAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const postReturnAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id, name, description, price, returnDate, period, isPublic, userId, userName, userLink } = req.share

  try {
    const authNum = await getShareAuthNumber(id)

    if (authNum === null || authNum !== req.body.authPassword) {
      throw new Err('그런 번호 없어. 저리 가!', 405)
    }

    await Share.updateShareStatus(id, ShareStatus.completeReturn)

    await Share.createShare({
      name,
      description,
      price,
      returnDate,
      period,
      isPublic,
      userId,
      userName,
      userLink
    })

    res.status(201).json().end()
  } catch (e) {
    next(e)
  }
}

export const updateShareStatusByTime = async () => {
  const now = Date.now()

  try {
    await Share.updateShareStatusByTime(now, ShareStatus.end)
  } catch (e) {
    logger.error(e.stack)
  }
}
