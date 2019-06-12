export interface VerifySaleParams {
  id: string
}

export interface PostSaleBody {
  itemName: string
  itemDescription: string
  itemPrice: string
  images: string[]
}

export interface PostSaleRes {
  urls: string[]
}

export interface GetDetailSaleRes {
  itemId: string
  itemName: string
  itemDescription: string
  itemPrice: string
  saleStatus?: string
  itemImages: string[]
  isFree: boolean
  ownerId: string
  ownerName: string
  ownerLink: string
  clientId?: string
  clientName?: string
  clientLink?: string
}

export interface PutSaleParams {
  id: string
}

export interface PutSaleBody {
  itemName: string
  itemDescription: string
  itemPrice: string
  images: string[]
}

export interface PutSaleRes {
  newImageUrls: string[]
}

export interface DeleteSaleParams {
  id: string
}

export interface GetSaleHistoryQuery {
  offset: string
  limit: string
}

export interface GetSaleHistoryRes {
  itemId: string
  itemName: string
  itemDescription: string
  saleStatus?: string
  registerDate?: Date
  saledDate?: Date
}
