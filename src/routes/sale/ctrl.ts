import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUploadUrl, ImageType } from '../../util/aws'
import Err from '../../util/error'
import DB, { SaleDocument } from '../../model/index'

const db: DB = new DB()

const postSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { itemName, itemDescription, itemPrice, images }:
    {itemName: string, itemDescription: string, itemPrice: string, images: string[]} = req.body
  const { id, displayName, profileUrl } = req.user

  try {
    const sale = await db.createSale({
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      images,
      userId: id,
      userName: displayName,
      userLink: profileUrl
    })

    const urls = getUploadUrl(ImageType.Sale, sale._id, images)

    res.status(201).json(urls).end()
  } catch (e) {
    next(e)
  }
}

const getDetailSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id
  const { id } = req.user

  try {
    const sale: SaleDocument = await db.findSaleById(itemId) as SaleDocument
    const { _id, name, description, price, status, images, userId, userName, userLink } = sale

    if (id !== userId) {
      throw new Err('이것은 너의 게시물이 아니다. 저리 가!', 403)
    }

    res.status(200).json({
      itemId: _id,
      itemName: name,
      itemDescription: description,
      itemPrice: price,
      saleStatus: status,
      itemImagePath: images,
      isFree: price === '0' ? true : false,
      userId: userId,
      userName: userName,
      userLink: userLink
    }).end()
  } catch (e) {
    next(e)
  }
}

const putSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

}

export { postSale, getDetailSale, putSale }
