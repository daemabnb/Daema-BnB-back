export interface VerifyPurchaseParams {
  id: string
}

export interface GetPurchaseQuery {
  offset: string
  limit: string
}

export interface GetPurchaseRes {
  itemId: string
  itemName: string
  itemPrice: string
  itemImages: string[]
  isFree: boolean
}

export interface GetDetailPurchaseRes {
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

export interface GetPurchaseHistoryQuery {
  offset: string
  limit: string
}

export interface GetPurchaseHistoryRes {
  itemId: string
  itemName: string
  itemDescription: string
  saleStatus?: string
  registerDate?: Date
  purchaseDate?: Date
}

export interface GetExchageAuthNumRes {
  authPassword: string
}
