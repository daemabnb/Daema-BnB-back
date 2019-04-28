import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUploadUrl, getDownloadUrl, ImageType } from '../../util/aws'
import Err from '../../util/error'
import DB from '../../model/index'

const db: DB = new DB()

const verifySale: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.id
  const userId = req.user.id

  try {
    const sale = await db.findSaleById(itemId)

    if (sale === null) {
      throw new Err('존재하지 않는 sale id', 405)
    }

    if (sale.userId !== userId) {
      throw new Err('너거 아니니까 저리 가!', 403)
    }

    req.sale = sale

    next()
  } catch (e) {
    next(e)
  }
}

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
  try {
    const { _id, name, description, price, status, images, userId, userName, userLink } = req.sale

    const downloadUrls: string[] = getDownloadUrl(ImageType.Sale,_id, images as string[])

    res.status(200).json({
      itemId: _id,
      itemName: name,
      itemDescription: description,
      itemPrice: price,
      saleStatus: status,
      itemImagePath: downloadUrls,
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
  const itemId = req.params.id
  const { itemName, itemDescription, itemPrice, addImages, deleteImages }:
    { itemName: string, itemDescription: string, itemPrice: string, addImages: string[], deleteImages: string[] }
    = req.body
  const { id, displayName, profileUrl } = req.user

  try {
    const sale = req.sale

    const images: string[] = sale.images as string[]
    const newImages = getNewImages(images, addImages, deleteImages)

    await db.updateSale(itemId, {
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      userId: id,
      userName: displayName,
      userLink: profileUrl,
      images: newImages
    })

    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

const deleteSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id

  try {
    await db.deleteSale(itemId)

    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

const getSaleHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit } = req.query
  const userId = req.user.id

  try {
    const sales = await db.findOwnSales(userId, parseInt(offset, 10), parseInt(limit, 10))

    const responseSales = sales.map(sale => {
      return {
        itemName: sale.name,
        itemDescription: sale.description,
        saleStatus: sale.status,
        registerDate: sale.createdAt,
        saledDate: sale.selledDate
      }
    })

    res.status(200).json(responseSales).end()
  } catch (e) {
    next(e)
  }
}

const getNewImages = (images: string[], addImages: string[], deleteImages: string[]): string[] => {
  deleteImages.forEach(deleteImg => {
    const index = images.indexOf(deleteImg)

    if (index === -1) {
      throw new Err('잘못된 이미지 삭제', 405)
    }

    images.splice(index, 1)
  })

  images.push(...addImages)

  return images
}

export { verifySale, postSale, getDetailSale, putSale, deleteSale, getSaleHistory }
