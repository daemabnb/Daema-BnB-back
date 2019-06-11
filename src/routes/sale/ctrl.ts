import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Sale } from '../../model/sale'
import { SaleStatus } from '../../types/Sale'
import { getUploadUrl, getDownloadUrl, ImageType } from '../../util/aws'
import Err from '../../util/error'
import { getImageNames, getImageLinks } from '../../util/image'

export const verifySale: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.id
  const userId = req.user.id

  try {
    const sale = await Sale.findSaleById(itemId)

    if (sale === null) {
      throw new Err('존재하지 않는 sale id. 저리 가!', 405)
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

export const postSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { itemName, itemDescription, itemPrice, images }:
    {itemName: string, itemDescription: string, itemPrice: string, images: string[]} = req.body
  const { id, displayName, profileUrl } = req.user

  try {
    const imageNames = await getImageNames(images)

    const sale = await Sale.createSale({
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      images: imageNames,
      userId: id,
      userName: displayName,
      userLink: profileUrl
    })

    const urls = getUploadUrl(ImageType.Sale, sale._id, imageNames)

    res.status(201).json(urls).end()
  } catch (e) {
    next(e)
  }
}

export const getDetailSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { _id, name, description, price, status, images, userId, userName, userLink, clientId, clientName, clientLink }
      = req.sale

    const downloadUrls: string[] = getDownloadUrl(ImageType.Sale,_id, images as string[])

    res.status(200).json({
      itemId: _id,
      itemName: name,
      itemDescription: description,
      itemPrice: price,
      saleStatus: status,
      itemImages: downloadUrls,
      isFree: price === '0' ? true : false,
      ownerId: userId,
      ownerName: userName,
      ownerLink: userLink,
      clientId,
      clientName,
      clientLink
    }).end()
  } catch (e) {
    next(e)
  }
}

export const putSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id
  const { itemName, itemDescription, itemPrice, images }:
    { itemName: string, itemDescription: string, itemPrice: string, images: string[] }
    = req.body
  const saleStatus = req.sale.status as string
  const { id, displayName, profileUrl } = req.user

  try {
    if (saleStatus === SaleStatus.beforeExchage) {
      throw new Err('동작 그만 밑장 빼기냐. 어디서 수정을 시도해?', 405)
    }

    const changedImages = await getImageNames(images)

    await Sale.updateSale(itemId, {
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      userId: id,
      userName: displayName,
      userLink: profileUrl,
      images: changedImages
    })

    const newImageLinks = getImageLinks(images, changedImages)
    const newImageUrls = getUploadUrl(ImageType.Sale, itemId, newImageLinks)

    res.status(201).json(newImageUrls).end()
  } catch (e) {
    next(e)
  }
}

export const deleteSale: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const itemId = req.params.id
  const saleStatus = req.sale.status

  try {
    if (saleStatus === SaleStatus.beforeExchage) {
      throw new Err('동작 그만 밑장 빼기냐. 어디서 삭제를 시도해?', 405)
    }

    await Sale.deleteSale(itemId)

    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

export const getSaleHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit } = req.query
  const userId = req.user.id

  try {
    const sales = await Sale.findOwnSales(userId, parseInt(offset, 10), parseInt(limit, 10))

    const responseSales = sales.map(sale => {
      return {
        itemId: sale._id,
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
