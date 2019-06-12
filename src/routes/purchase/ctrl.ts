import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Sale } from '../../model/sale'
import { SaleStatus } from '../../types/Sale'
import * as purchaseType from '../../types/ctrl/purchase'
import { getDownloadUrl, ImageType } from '../../util/aws'
import { setSaleAuthNumber, getSaleAuthNumber } from '../../util/redis'
import Err from '../../util/error'

export const verifyPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params: purchaseType.VerifyPurchaseParams = req.params
    const itemId = params.id

    const sale = await Sale.findSaleById(itemId)

    if (sale === null) {
      throw new Err('존재하지 않는 sale id. 저리 가!', 405)
    }

    req.sale = sale

    next()
  } catch (e) {
    next(e)
  }
}

export const getPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query: purchaseType.GetPurchaseQuery = req.query
    const { offset, limit } = query

    const sales = await Sale.findPurchases(parseInt(offset, 10), parseInt(limit, 10))

    const response: purchaseType.GetPurchaseRes[] = sales.map(sale => {
      const { _id, name, price } = sale
      const images = sale.images as string[]
      const image = getDownloadUrl(ImageType.Sale, _id, [images[0]])

      return {
        itemId: _id,
        itemName: name,
        itemPrice: price,
        itemImages: image,
        isFree: price === '0' ? true : false
      }
    })

    res.status(200).json(response).end()
  } catch (e) {
    next(e)
  }
}

export const getDetailPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { _id, name, description, price, status, images, userId, userName, userLink, clientId, clientName, clientLink }
    = req.sale

    const downloadUrls: string[] = getDownloadUrl(ImageType.Sale,_id, images as string[])

    const response: purchaseType.GetDetailPurchaseRes = {
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
    }
    res.status(200).json(response).end()
  } catch (error) {
    next(error)
  }
}

export const postPurchase: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { _id, status } = req.sale
    const { id, displayName, profileUrl } = req.user

    if (status !== SaleStatus.onSale) {
      throw new Err('안 팔아. 저리 가!', 405)
    }

    await Sale.updateSaleClient(_id, SaleStatus.beforeExchage, {
      id,
      name: displayName,
      link: profileUrl
    })

    await setSaleAuthNumber(_id)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

export const getPurchaseHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query: purchaseType.GetPurchaseHistoryQuery = req.query
    const { offset, limit } = query
    const userId = req.user.id

    const purchases = await Sale.findOwnPurchase(userId, parseInt(offset, 10), parseInt(limit, 10))

    const response: purchaseType.GetPurchaseHistoryRes[] = purchases.map(purchase => ({
      itemId: purchase._id,
      itemName: purchase.name,
      itemDescription: purchase.description,
      saleStatus: purchase.status,
      registerDate: purchase.createdAt,
      purchaseDate: purchase.selledDate
    }))

    res.status(200).json(response).end()
  } catch (e) {
    next(e)
  }
}

export const getExchageAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const saleId = req.sale.id
    const authNum = await getSaleAuthNumber(saleId)

    if (authNum === null) {
      throw new Err('얘는 인증번호가 없어. 저리 가!', 405)
    }

    const response: purchaseType.GetExchageAuthNumRes = {
      authPassword: authNum
    }
    res.status(200).json(response).end()
  } catch (e) {
    next(e)
  }
}

export const postExchageAuthNum: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const saleId = req.sale.id

    const authNum = await getSaleAuthNumber(saleId)

    if (authNum === null || authNum !== req.body.authPassword) {
      throw new Err('그런 번호 없어. 저리 가!', 405)
    }

    await Sale.updateSaleStatus(saleId, SaleStatus.selled)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}
