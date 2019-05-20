import * as Redis from 'ioredis'

const redisClient: Redis.Redis = new Redis()

const addAuthWaitingList =
async (email: string, authNum: string, expireTime: number = 60 * 60 * 24 * 3): Promise<void> => {
  try {
    await redisClient.select(4)
    await redisClient.set(email, authNum, 'EX', expireTime)
  } catch (e) {
    throw new Error(e)
  }
}

const getEmailAuthNumber = async (email: string): Promise<string | null> => {
  try {
    await redisClient.select(4)
    const authNum = await redisClient.get(email)

    return authNum
  } catch (e) {
    throw new Error(e)
  }
}

const setSaleAuthNumber = async (saleId: string, expireTime: number = 60 * 60 * 24 * 3): Promise<void> => {
  try {
    await redisClient.select(5)
    const authNum = createAuthNum()

    await redisClient.set(saleId, authNum, 'EX', expireTime)
  } catch (e) {
    throw new Error(e)
  }
}

const getSaleAuthNumber = async (saleId: string): Promise<string | null> => {
  try {
    await redisClient.select(5)
    const authNum = await redisClient.get(saleId)

    return authNum
  } catch (e) {
    throw new Error(e)
  }
}

const setShareAuthNumber = async (saleId: string, expireTime: number = 60 * 60 * 24 * 3): Promise<void> => {
  try {
    await redisClient.select(6)
    const authNum = createAuthNum()

    await redisClient.set(saleId, authNum, 'EX', expireTime)
  } catch (e) {
    throw new Error(e)
  }
}

const getShareAuthNumber = async (shareId: string): Promise<string | null> => {
  try {
    await redisClient.select(6)
    const authNum = await redisClient.get(shareId)

    return authNum
  } catch (e) {
    throw new Error(e)
  }
}

const setReturnAuthNumber = async (shareId: string, expireTime: number = 60 * 60 * 24 * 3): Promise<void> => {
  try {
    await redisClient.select(7)
    const authNum = createAuthNum()

    await redisClient.set(shareId, authNum, 'EX', expireTime)
  } catch (e) {
    throw new Error(e)
  }
}

const getReturnAuthNumber = async (shareId: string): Promise<string | null> => {
  try {
    await redisClient.select(7)
    const authNum = await redisClient.get(shareId)

    return authNum
  } catch (e) {
    throw new Error(e)
  }
}

const createAuthNum = (): string => {
  let authNum: string = ''

  for (let i = 0; i < 4; i++) {
    const random = Math.floor((Math.random() * 9 + 0)).toString()
    authNum = authNum.concat(random)
  }

  return authNum
}

export { addAuthWaitingList, getEmailAuthNumber, setSaleAuthNumber,
  getSaleAuthNumber, setShareAuthNumber, getShareAuthNumber, getReturnAuthNumber, setReturnAuthNumber }
