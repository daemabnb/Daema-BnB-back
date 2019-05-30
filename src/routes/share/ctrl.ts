import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUploadUrl, getDownloadUrl, ImageType } from '../../util/aws'
import { getImageNames, getImageLinks } from '../../util/image'
import {} from '../../util/redis'
import Err from '../../util/error'
import DB, { ShareStatus } from '../../model/index'

const db: DB = new DB()

const verifyShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id

  try {
    const share = await db.findShareById(itemId)

    if (share === null) {
      throw new Err('존재하지 않는 share id. 저리 가!', 405)
    }

    req.share = share

    next()
  } catch (e) {
    next(e)
  }
}

const postShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { itemName, itemDescription, itemPrice, returnDate, period, isPublic, images } = req.body
  const { id, displayName, profileUrl } = req.user

  try {
    const imageNames = await getImageNames(images)

    const share = await db.createShare({
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      returnDate,
      period,
      isPublic,
      images: imageNames,
      userId: id,
      userName: displayName,
      userLink: profileUrl
    })

    const urls = getUploadUrl(ImageType.Share, share._id, imageNames)

    res.status(201).json(urls).end()
  } catch (e) {
    next(e)
  }
}

const getDetailShare: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { _id, name, description, price, status, returnDate, sharedDate, period, isPublic, images,
    userId, userName, userLink, clientId, clientName, clientLink } = req.share

  const downloadUrls: string[] = getDownloadUrl(ImageType.Share, _id, images as string[])

  res.status(200).json({
    itemId: _id,
    itemName: name,
    itemDescription: description,
    itemPrice: price,
    shareStatus: status,
    itemImages: downloadUrls,
    isFree: price === '0' ? true : false,
    sharedDate,
    returnDate,
    period,
    isPublic,
    ownerId: userId,
    ownerName: userName,
    ownerLink: userLink,
    clientId,
    clientName,
    clientLink
  }).end()
}

const putShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id
  const { itemName, itemDescription, itemPrice, returnDate, period, isPublic, images } = req.body
  const shareStatus = req.share.status as string
  const { id, displayName, profileUrl } = req.user

  try {
    if (shareStatus !== ShareStatus.onShare) {
      throw new Err('동작 그만, 밑장 빼기냐. 어디서 수정을 시도해?', 405)
    }

    const changedImages = await getImageNames(images)

    await db.updateShare(itemId, {
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      returnDate,
      period,
      isPublic,
      userId: id,
      userName: displayName,
      userLink: profileUrl,
      images: changedImages
    })

    const newImageLinks = getImageLinks(images, changedImages)
    const newImageUrls = getUploadUrl(ImageType.Share, itemId, newImageLinks)

    res.status(201).json(newImageUrls).end()
  } catch (e) {
    next(e)
  }
}

const deleteShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id
  const shareStatus = req.share.status

  try {
    if (shareStatus !== ShareStatus.onShare) {
      throw new Err('동작 그만 밑장 빼기냐. 어디서 삭제를 시도해?', 405)
    }

    await db.deleteShare(itemId)

    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

const getShareHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query
  const userId = req.user.id

  try {
    const shares = await db.findOwnShares(userId, parseInt(offset, 10), parseInt(limit, 10))

    const responseShares = shares.map(share => {
      return {
        itemId: share._id,
        itemName: share.name,
        itemDescription: share.description,
        shareStatus: share.status,
        registerDate: share.createdAt,
        returnDate: share.returnDate,
        sharedDate: share.sharedDate,
        period: share.period,
        isPublic: share.isPublic,
        clientName: share.clientName
      }
    })

    res.status(200).json(responseShares).end()
  } catch (e) {
    next(e)
  }
}

export { verifyShare, postShare, getDetailShare, putShare, deleteShare, getShareHistory }
