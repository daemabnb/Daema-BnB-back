import { createServer } from 'spdy'
import { readFileSync } from 'fs'
import app from '../app'
import { keyPath, certPath } from '../config'

const spdyOptions = {
  key: readFileSync(keyPath),
  cert: readFileSync(certPath),
  protocol: ['h2']
}

const PORT = process.env.PORT || 3000

createServer(spdyOptions, app).listen(PORT, () => console.log('start'))
