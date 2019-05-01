import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUploadUrl, getDownloadUrl, ImageType } from '../../util/aws'
import { getImageNames } from '../../util/image'
import Err from '../../util/error'
import DB from '../../model/index'

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
  const { _id, name, description, price, status, returnDate, period, isPublic, images, userId, userName, userLink }
  = req.share

  const downloadUrls: string[] = getDownloadUrl(ImageType.Share, _id, images as string[])

  res.status(200).json({
    itemId: _id,
    itemName: name,
    itemDescription: description,
    itemPrice: price,
    shareStatus: status,
    itemImages: downloadUrls,
    isFree: price === '0' ? true : false,
    returnDate,
    period,
    isPublic,
    userId,
    userName,
    userLink
  }).end()
}

export { verifyShare, postShare, getDetailShare }
