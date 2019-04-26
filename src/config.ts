import { config } from 'dotenv'

config()

const keyPath = process.env.KEY_PATH as string
const certPath = process.env.CERT_PATH as string
const mongoUri = process.env.MONGO_URI as string
const jwtSecret = process.env.JWT_SECRET as string
const emailId = process.env.EMAIL_ID as string
const emailPw = process.env.EMAIL_PW as string
const clientID = process.env.FACEBOOK_CLIENT_ID as string
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET as string

export { keyPath, certPath, mongoUri, jwtSecret, emailId, emailPw, clientID, clientSecret }
