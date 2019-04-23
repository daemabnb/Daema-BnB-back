import { createServer } from 'spdy'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import app from '../app'

config()

const keyPath = process.env.KEY_PATH as string
const certPath = process.env.CERT_PATH as string

const options = {
  key: readFileSync(keyPath),
  cert: readFileSync(certPath),
  protocol: ['h2']
}

const PORT = process.env.PORT || 3000

createServer(options, app).listen(PORT, () => console.log('start'))
