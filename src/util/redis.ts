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

const getEmailAuthNumber = async (email: string): Promise<string> => {
  try {
    await redisClient.select(4)
    const authNum = await redisClient.get(email) as string

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

const getSaleAuthNumber = async (saleId: string): Promise<string> => {
  try {
    await redisClient.select(5)
    const authNum = await redisClient.get(saleId) as string

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

export { addAuthWaitingList, getEmailAuthNumber, setSaleAuthNumber, getSaleAuthNumber }
