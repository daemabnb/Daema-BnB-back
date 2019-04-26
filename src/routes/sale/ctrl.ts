import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUploadUrl, getDownloadUrl, ImageType } from '../../util/aws'
import { Sale, SaleFormat } from '../../model/sale'

const postSale = async (req: Request, res: Response, next: NextFunction) => {
  const { itemName, itemDescription, itemPrice, images } = req.body
  const { id, displayName, profileUrl } = req.user

  try {
    const newSale: SaleFormat = new Sale({
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      images,
      userId: id,
      userName: displayName,
      userLink: profileUrl
    })

    const sale: SaleFormat = await newSale.save()

    const urls = getUploadUrl(ImageType.Sale, sale._id, images)

    res.status(201).json(urls).end()
  } catch (e) {
    next(e)
  }
}

export { postSale }
