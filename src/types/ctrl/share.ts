export interface VerifyShareParams {
  id: string
}

export interface PostShareBody {
  itemName: string
  itemDescription: string
  itemPrice: string
  returnDate: number
  period: number
  isPublic: boolean
  images: string[]
}

export interface PostShareRes {
  urls: string[]
}

export interface GetDetailShareRes {
  itemId: string
  itemName: string
  itemDescription: string
  itemPrice: string
  shareStatus?: string
  itemImages: string[]
  isFree: boolean
  sharedDate?: number
  deadline: number
  period: number
  isPublic: boolean
  ownerId: string
  ownerName: string
  ownerLink: string
  clientId?: string
  clientName?: string
  clientLink?: string
}

export interface PutShareParams {
  id: string
}

export interface PutShareBody {
  itemName: string
  itemDescription: string
  itemPrice: string
  deadline: number
  period: number
  isPublic: boolean
  images: string[]
}

export interface PutShareRes {
  urls: string[]
}

export interface DeleteShareParams {
  id: string
}

export interface GetShareHistoryQuery {
  offset: string
  limit: string
}

export interface GetShareHistoryRes {
  itemId: string
  itemName: string
  itemDescription: string
  shareStatus?: string
  registerDate?: Date
  deadline: number
  sharedDate?: number
  period: number
  isPublic: boolean
  clientName?: string
}
