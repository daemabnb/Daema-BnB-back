import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUploadUrl, ImageType } from '../../util/aws'
import { getImageNames } from '../../util/image'
import DB from '../../model/index'

const db: DB = new DB()

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

export { postShare }
