import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Share } from '../../model/share'
import { ShareStatus } from '../../types/Share'
import * as shareType from '../../types/ctrl/share'
import { getUploadUrl, getDownloadUrl, ImageType } from '../../util/aws'
import { getImageNames, getImageLinks } from '../../util/image'
import {} from '../../util/redis'
import Err from '../../util/error'

export const verifyShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params: shareType.VerifyShareParams = req.params
    const itemId = params.id

    const share = await Share.findShareById(itemId)

    if (share === null) {
      throw new Err('존재하지 않는 share id. 저리 가!', 405)
    }

    req.share = share

    next()
  } catch (e) {
    next(e)
  }
}

export const postShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body: shareType.PostShareBody = req.body
    const { itemName, itemDescription, itemPrice, deadline, period, isPublic, images } = body
    const { id, displayName, profileUrl } = req.user

    const imageNames = await getImageNames(images)

    const share = await Share.createShare({
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      returnDate: deadline,
      period,
      isPublic,
      images: imageNames,
      userId: id,
      userName: displayName,
      userLink: profileUrl
    })

    const urls = getUploadUrl(ImageType.Share, share._id, imageNames)

    const response: shareType.PostShareRes = { urls }
    res.status(201).json(response).end()
  } catch (e) {
    next(e)
  }
}

export const getDetailShare: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { _id, name, description, price, status, returnDate, sharedDate, period, isPublic, images,
      userId, userName, userLink, clientId, clientName, clientLink } = req.share

    const downloadUrls: string[] = getDownloadUrl(ImageType.Share, _id, images as string[])

    const response: shareType.GetDetailShareRes = {
      itemId: _id,
      itemName: name,
      itemDescription: description,
      itemPrice: price,
      shareStatus: status,
      itemImages: downloadUrls,
      isFree: price === '0' ? true : false,
      sharedDate,
      deadline: returnDate,
      period,
      isPublic,
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

export const putShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params: shareType.PutShareParams = req.params
    const body: shareType.PutShareBody = req.body
    const itemId = params.id
    const { itemName, itemDescription, itemPrice, deadline, period, isPublic, images } = body
    const shareStatus = req.share.status as string
    const { id, displayName, profileUrl } = req.user

    if (shareStatus !== ShareStatus.onShare) {
      throw new Err('동작 그만, 밑장 빼기냐. 어디서 수정을 시도해?', 405)
    }

    const changedImages = await getImageNames(images)

    await Share.updateShare(itemId, {
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      returnDate: deadline,
      period,
      isPublic,
      userId: id,
      userName: displayName,
      userLink: profileUrl,
      images: changedImages
    })

    const newImageLinks = getImageLinks(images, changedImages)
    const newImageUrls = getUploadUrl(ImageType.Share, itemId, newImageLinks)

    const response: shareType.PutShareRes = { urls: newImageUrls }
    res.status(201).json(response).end()
  } catch (e) {
    next(e)
  }
}

export const deleteShare: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params: shareType.DeleteShareParams = req.params
    const itemId = params.id
    const shareStatus = req.share.status

    if (shareStatus !== ShareStatus.onShare) {
      throw new Err('동작 그만 밑장 빼기냐. 어디서 삭제를 시도해?', 405)
    }

    await Share.deleteShare(itemId)

    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

export const getShareHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query: shareType.GetShareHistoryQuery = req.query
    const { offset, limit } = query
    const userId = req.user.id

    const shares = await Share.findOwnShares(userId, parseInt(offset, 10), parseInt(limit, 10))

    const response: shareType.GetShareHistoryRes[] = shares.map(share => ({
      itemId: share._id,
      itemName: share.name,
      itemDescription: share.description,
      shareStatus: share.status,
      registerDate: share.createdAt,
      deadline: share.returnDate,
      sharedDate: share.sharedDate,
      period: share.period,
      isPublic: share.isPublic,
      clientName: share.clientName
    }))

    res.status(200).json(response).end()
  } catch (e) {
    next(e)
  }
}
