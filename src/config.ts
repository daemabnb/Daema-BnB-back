import { config } from 'dotenv'

config()

export const keyPath = process.env.KEY_PATH as string
export const certPath = process.env.CERT_PATH as string
export const mongoUri = process.env.MONGO_URI as string
export const jwtSecret = process.env.JWT_SECRET as string
export const emailId = process.env.EMAIL_ID as string
export const emailPw = process.env.EMAIL_PW as string
export const clientID = process.env.FACEBOOK_CLIENT_ID as string
export const clientSecret = process.env.FACEBOOK_CLIENT_SECRET as string
export const facebookCallback = process.env.FACEBOOK_CALLBACK as string
export const accessKey = process.env.ACCESS_KEY as string
export const secretAccessKey = process.env.SECRET_ACCESS_KEY as string
export const slackUrl = process.env.SLACK_URL as string
export const redisHost = process.env.REDIS_HOST as string
export const redisPort = parseInt(process.env.REDIS_PORT as string, 10)
