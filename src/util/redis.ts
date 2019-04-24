import * as Redis from 'ioredis'

const redisClient: Redis.Redis = new Redis()

const addAuthWaitingList = async (email: string, authNum: string): Promise<void> => {
  try {
    await redisClient.select(4)
    await redisClient.set(email, email, 'EX', 60 * 60 * 24 * 3)
  } catch (e) {
    throw new Error(e)
  }
}

const getAuthNumber = async (email: string): Promise<string> => {
  try {
    await redisClient.select(4)
    const authNum = await redisClient.get(email) as string

    return authNum
  } catch (e) {
    throw new Error(e)
  }
}

export { addAuthWaitingList, getAuthNumber }
