export interface VerifyRentalParams {
  id: string
}

export interface GetRentalQuery {
  offset: string
  limit: string
}

export interface GetRentalRes {
  itemId: string
  itemName: string
  itemPrice: string
  itemImages: string[]
  isFree: boolean
  deadline: number
  period: number
  isPublic: boolean
}

export interface GetDetailRentalRes {
  itemId: string
  itemName: string
  itemDescription: string
  itemPrice: string
  saleStatus?: string
  itemImages: string[]
  isFree: boolean
  isPublic: boolean
  sharedDate?: number
  deadline: number
  period: number
  ownerId: string
  ownerName: string
  ownerLink: string
  clientId?: string
  clientName?: string
  clientLink?: string
}

export interface GetRentalHistoryQuery {
  offset: string
  limit: string
}

export interface GetRentalHistoryRes {
  itemId: string
  itemName: string
  itemDescription: string
  shareStatus?: string
  registerDate?: Date
  sharedDate?: number
  deadline: number
  period: number
  isPublic: boolean
  ownerName: string
}

export interface GetExchangeAuthNumRes {
  authPassword: string
}

export interface GetReturnAuthNumRes {
  authPassword: string
}
